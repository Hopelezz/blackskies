// /src/pages/api/posts/[id].ts
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Missing tokens" }),
      {
        status: 401,
      }
    );
  }

  try {
    // Set the session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });

    if (sessionError || !session) {
      console.error("Session error:", sessionError);
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
      });
    }

    // Log the session user ID
    console.log("Session user ID:", session.user.id);

    // Fetch the user's role from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profile")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching profile:", profileError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch user role" }),
        {
          status: 500,
        }
      );
    }

    // Log the user's role
    console.log("User role:", profile.role);

    const postId = params.id;

    // First, fetch the post to check ownership
    const { data: post, error: postFetchError } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", postId)
      .single();

    if (postFetchError) {
      console.error("Error fetching post:", postFetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch post" }), {
        status: 500,
      });
    }

    // Check if user has permission to delete the post
    const isAdmin = profile.role === "admin";
    const isEditor = profile.role === "editor";
    const isAuthor = post.author_id === session.user.id;

    if (!isAdmin && !isEditor && !isAuthor) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized: Must be admin, editor, or post author",
        }),
        {
          status: 403,
        }
      );
    }

    // Delete the post
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (deleteError) {
      console.error("Error deleting post:", deleteError);
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Post deleted successfully",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: errorMessage,
      }),
      { status: 500 }
    );
  }
};

export const PUT: APIRoute = async ({ request, params, cookies }) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });

    if (sessionError || !session) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
      });
    }

    const data = await request.json();
    const { title, slug, content, tags, status } = data;

    if (!title || !slug || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("posts")
      .update({
        title,
        slug,
        content,
        tags: tags || [],
        published: status === "published",
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
};
