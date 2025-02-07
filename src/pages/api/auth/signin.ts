// src/pages/api/auth/signin.ts
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import type { Provider } from "@supabase/supabase-js";

const testAccounts = [
  { email: "admin@blackskies.com", password: "DarkMatter" },
  { email: "editor@test.com", password: "DarkMatter" },
  { email: "author@test.com", password: "DarkMatter" },
  { email: "viewer@test.com", password: "DarkMatter" },
];

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const provider = formData.get("provider")?.toString();

  const validProviders = ["google", "github", "discord"];

  if (provider && validProviders.includes(provider)) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `${import.meta.env.PUBLIC_SITE_URL}/api/auth/callback`,
      },
    });

    if (error) {
      return new Response(error.message, { status: 500 });
    }

    return redirect(data.url);
  }

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  // Check if the email and password match any test accounts
  const testAccount = testAccounts.find(
    (account) => account.email === email && account.password === password
  );

  if (testAccount) {
    // Simulate successful login for test accounts
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testAccount.email,
      password: testAccount.password,
    });

    if (error) {
      return new Response(error.message, { status: 500 });
    }

    const { access_token, refresh_token } = data.session;

    // Set both tokens with proper configuration
    cookies.set("sb-access-token", access_token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    cookies.set("sb-refresh-token", refresh_token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return redirect("/admin/dashboard");
  }

  // If not a test account, proceed with normal sign-in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const { access_token, refresh_token } = data.session;

  // Set both tokens with proper configuration
  cookies.set("sb-access-token", access_token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return redirect("/admin/dashboard");
};