// check users role before allowing them to access admin pages
// Check against the profile table
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (!session || error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("role")
    .eq("id", session.user?.id)
    .single();
  if (profileError || !profile) {
    console.error("Error fetching profile:", profileError);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user role" }),
      { status: 500 }
    );
  }
  // Log the user's role
  console.log("User role:", profile.role);
  if (profile.role === "admin") {
    // admin access granted
    // return the admin page content
    //...
    return new Response(JSON.stringify({ message: "Admin access granted" }), {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Admin access required" }),
      { status: 403 }
    );
  }
};
