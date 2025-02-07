// src/pages/api/auth/create-test-account.ts
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Verify admin access
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401 });
    }

    // Check if current user is admin
    const { data: adminProfile, error: profileError } = await supabase
      .from("profile")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return new Response(JSON.stringify({ error: "Failed to fetch profile" }), { status: 400 });
    }

    console.log("Admin Profile:", adminProfile); // Log the admin profile for debugging

    if (adminProfile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    // Get request data
    const { email, password, fullName, role } = await request.json();

    // Create the user
    const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
    });

    console.log("New User Data:", newUser); // Log the new user data for debugging

    if (signUpError) {
      console.error("User creation error:", signUpError);
      return new Response(JSON.stringify({ error: signUpError.message }), { status: 400 });
    }

    // Update the profile
    const { error: profileUpdateError } = await supabase
      .from("profile")
      .update({
        full_name: fullName,
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", newUser.user.id);

    if (profileUpdateError) {
      // Attempt to clean up the created user if profile update fails
      await supabase.auth.admin.deleteUser(newUser.user.id);
      console.error("Profile update error:", profileUpdateError);
      return new Response(JSON.stringify({ error: profileUpdateError.message }), { status: 400 });
    }

    return new Response(
      JSON.stringify({ message: "Test account created successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating test account:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create test account" }),
      { status: 500 }
    );
  }
};