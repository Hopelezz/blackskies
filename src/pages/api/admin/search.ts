// src/pages/api/admin/search.ts
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async ({ url, cookies }) => {
  try {
    const query = url.searchParams.get('q')?.toLowerCase();
    const accessToken = cookies.get("sb-access-token")?.value;

    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!query) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Search posts
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        slug,
        published,
        created_at
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(5);

    // Search users/profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profile")
      .select(`
        id,
        user_id,
        full_name,
        email,
        role,
        created_at
      `)
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(5);

    if (postsError || profilesError) {
      throw postsError || profilesError;
    }

    // Combine and format results
    const results = [
      ...(posts?.map(post => ({
        ...post,
        type: 'post'
      })) || []),
      ...(profiles?.map(profile => ({
        ...profile,
        type: 'user'
      })) || [])
    ].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return new Response(
      JSON.stringify({ results }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Search error:", error);
    return new Response(
      JSON.stringify({ error: "Search failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};