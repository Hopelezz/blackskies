// src/pages/api/auth/signout.ts
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear cookies
    cookies.delete("sb-access-token", { 
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "strict"
    });
    
    cookies.delete("sb-refresh-token", { 
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "strict"
    });

    return redirect("/admin/signin");
  } catch (error) {
    console.error("Sign out error:", error);
    return new Response(JSON.stringify({ error: "Failed to sign out" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};