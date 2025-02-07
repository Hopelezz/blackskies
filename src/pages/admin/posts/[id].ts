// src/pages/api/posts/[id].ts
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

// Get a single post
export const GET: APIRoute = async ({ params, cookies }) => {
  try {
    const { id } = params;
    const accessToken = cookies.get("sb-access-token")?.value;
    
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const { data: post, error } = await supabase
      .from("posts")
      .select(`
        *,
        profile:author_id (
          username,
          full_name
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: "Post not found" }),
        { 
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ data: post }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

// Update a post
export const PUT: APIRoute = async ({ request, params, cookies }) => {
  try {
    const { id } = params;
    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;

    if (!accessToken || !refreshToken) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Parse request body
    const formData = await request.json();
    const { title, slug, content, tags, published } = formData;

    // Validate required fields
    if (!title || !slug || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Check if user has permission to edit this post
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("author_id, slug")
      .eq("id", id)
      .single();

    if (postError || !post) {
      return new Response(
        JSON.stringify({ error: "Post not found" }),
        { 
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Check if user is author or admin
    const { data: profile } = await supabase
      .from("profile")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (post.author_id !== user.id && profile?.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Unauthorized to edit this post" }),
        { 
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Check if new slug is unique (if changed)
    if (slug !== post.slug) {
      const { data: existingPost, error: slugError } = await supabase
        .from("posts")
        .select("id")
        .eq("slug", slug)
        .neq("id", id)
        .single();

      if (existingPost) {
        return new Response(
          JSON.stringify({ error: "Slug already exists" }),
          { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }

    // Update the post
    const { data: updatedPost, error: updateError } = await supabase
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
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ data: updatedPost }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

// Delete a post
export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    const { id } = params;
    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;

    if (!accessToken || !refreshToken) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Check if user has permission to delete this post
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", id)
      .single();

    if (postError || !post) {
      return new Response(
        JSON.stringify({ error: "Post not found" }),
        { 
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Check if user is author or admin
    const { data: profile } = await supabase
      .from("profile")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (post.author_id !== user.id && profile?.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Unauthorized to delete this post" }),
        { 
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
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
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Post deleted successfully" }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};