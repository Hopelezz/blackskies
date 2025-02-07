// src/pages/api/profile/update.ts
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Set the session
    const { data: { user }, error: sessionError } = await supabase.auth.getUser(accessToken);
    if (sessionError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401 });
    }

    const formData = await request.json();
    const { username, email, full_name, role, bio } = formData;

    const { data, error } = await supabase
      .from("profile")
      .update({
        username,
        email,
        full_name,
        role,
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};