import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  // Debug log
  console.log(
    "Tokens present:",
    "Access Token-",
    !!accessToken,
    "Refresh Token-",
    !!refreshToken
  );

  if (!accessToken || !refreshToken) {
    return new Response(
      JSON.stringify({
        error: "Missing token",
        details: "Missing access or refresh token",
      }),
      { status: 401 }
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

    // Debug log
    console.log("Session error:", sessionError);
    console.log("Session exists:", !!session);

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({
          error: "Invalid session",
          details: sessionError?.message,
        }),
        { status: 401 }
      );
    }

    // Get user role directly from session if possible
    const { data: userData, error: userError } = await supabase.auth.getUser(
      accessToken.value
    );

    // Debug log
    console.log("User data:", userData);
    console.log("User error:", userError);

    if (userError) {
      return new Response(
        JSON.stringify({
          error: "User verification failed",
          details: userError.message,
        }),
        { status: 401 }
      );
    }

    // Parse the request body
    const data = await request.json();
    const { title, slug, content, tags, status } = data;

    if (!title || !slug || !content) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          required: ["title", "slug", "content"],
          received: { title: !!title, slug: !!slug, content: !!content },
        }),
        { status: 400 }
      );
    }

    // Insert the post
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert([
        {
          title,
          slug,
          content,
          author_id: session.user.id,
          published: status === "published",
          tags: tags || [],
        },
      ])
      .select()
      .single();

    if (postError) {
      return new Response(
        JSON.stringify({
          error: "Database error",
          details: postError.message,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        post,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({
        error: "Server error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
};
