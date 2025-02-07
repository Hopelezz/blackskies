// src/pages/api/auth/callback.ts
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

  // Set cookies with expiration
  const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  };

  cookies.set("sb-access-token", access_token, cookieOptions);
  cookies.set("sb-refresh-token", refresh_token, cookieOptions);

  return redirect("/admin/dashboard");
};