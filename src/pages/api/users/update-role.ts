// src/pages/api/users/update-role.ts
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Verify the current user is an admin
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401 });
    }

    const { data: currentUserProfile } = await supabase
      .from("profile")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (currentUserProfile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
    }

    // Update the user's role
    const { userId, role } = await request.json();
    const { error: updateError } = await supabase
      .from("profile")
      .update({ role })
      .eq("user_id", userId);

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Role updated successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};