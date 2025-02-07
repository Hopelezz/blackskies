import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;

    if (!accessToken || !refreshToken) {
      return new Response(
        JSON.stringify({ error: "Missing authentication tokens" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Set the session
    const { data: { session }, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await request.json();
    const { title, slug, content, tags, published = false } = formData;

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title,
        slug,
        content,
        tags,
        published,
        author_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Post creation error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;

    if (!accessToken || !refreshToken) {
      return new Response(
        JSON.stringify({ error: "Missing authentication tokens" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};