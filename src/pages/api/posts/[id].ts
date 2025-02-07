// src/pages/api/posts/[id].ts
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    const { id } = params;
    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;

    if (!accessToken || !refreshToken) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Get the current user's session
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { status: 401 }
      );
    }

    // Get the user's profile to check role
    const { data: profile, error: profileError } = await supabase
      .from("profile")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch user role" }),
        { status: 500 }
      );
    }

    // Get the post to check ownership
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", id)
      .single();

    if (postError) {
      return new Response(
        JSON.stringify({ error: "Post not found" }),
        { status: 404 }
      );
    }

    // Check if user is authorized to delete the post
    const isAdmin = profile?.role === "admin";
    const isAuthor = post.author_id === user.id;

    if (!isAdmin && !isAuthor) {
      return new Response(
        JSON.stringify({ error: "Unauthorized to delete this post" }),
        { status: 403 }
      );
    }

    // Delete the post
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return new Response(
        JSON.stringify({ error: deleteError.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Post deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  try {
    const { id } = params;
    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;

    if (!accessToken || !refreshToken) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Get the current user's session
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { status: 401 }
      );
    }

    // Get the user's profile to check role
    const { data: profile, error: profileError } = await supabase
      .from("profile")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch user role" }),
        { status: 500 }
      );
    }

    // Get the post to check ownership
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("author_id, slug")
      .eq("id", id)
      .single();

    if (postError) {
      return new Response(
        JSON.stringify({ error: "Post not found" }),
        { status: 404 }
      );
    }

    // Check if user is authorized to update the post
    const isAdmin = profile?.role === "admin";
    const isAuthor = post.author_id === user.id;

    if (!isAdmin && !isAuthor) {
      return new Response(
        JSON.stringify({ error: "Unauthorized to update this post" }),
        { status: 403 }
      );
    }

    // Parse the request body
    const formData = await request.json();
    const { title, slug, content, tags, published = false } = formData;

    // Check if the slug is being updated and ensure it's unique
    if (slug && slug !== post.slug) {
      const { data: existingPost, error: slugError } = await supabase
        .from("posts")
        .select("id")
        .eq("slug", slug)
        .single();

      if (slugError && slugError.code !== "PGRST116") {
        // PGRST116 means no rows were found, so it's safe to ignore
        return new Response(
          JSON.stringify({ error: "Error checking slug uniqueness" }),
          { status: 500 }
        );
      }

      if (existingPost) {
        return new Response(
          JSON.stringify({ error: "Slug already exists" }),
          { status: 400 }
        );
      }
    }

    // Update the post
    const { data, error: updateError } = await supabase
      .from("posts")
      .update({
        title,
        slug,
        content,
        tags,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
};

// [WARN] [router] No API Route handler exists for the method "GET" for the route "/api/posts/check-slug".

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  const { data, error } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .single();
  if (!data) {
    return new Response(JSON.stringify({ available: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ available: false }), { status: 200 });
  }
};