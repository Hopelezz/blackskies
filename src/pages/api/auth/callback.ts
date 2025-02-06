import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const authCode = url.searchParams.get("code");

  if (!authCode) {
    return new Response("No code provided", { status: 400 });
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const { access_token, refresh_token } = data.session;

  // Set cookies with a global path
  cookies.set("sb-access-token", access_token, {
    path: "/", // Make the cookie available for all routes
    httpOnly: true,
    secure: true, // Use secure cookies in production
    sameSite: "strict",
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/", // Make the cookie available for all routes
    httpOnly: true,
    secure: true, // Use secure cookies in production
    sameSite: "strict",
  });

  return redirect("/admin/dashboard");
};
