// src/pages/api/users/delete.ts
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const DELETE: APIRoute = async ({ request, cookies }) => {
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

    // Delete the user
    const { userId } = await request.json();
    
    // Delete user's profile first (due to foreign key constraints)
    await supabase
      .from("profile")
      .delete()
      .eq("user_id", userId);

    // Delete user's posts
    await supabase
      .from("posts")
      .delete()
      .eq("author_id", userId);

    // Delete the user from auth.users
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};