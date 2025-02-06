// src/utils/auth.ts
import type { AstroGlobal } from "astro";
import type { SessionData } from "../types/supabase";
import { supabase } from "../lib/supabase";

export async function getSession(Astro: AstroGlobal) {
  const accessToken = Astro.cookies.get("sb-access-token");
  const refreshToken = Astro.cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) {
    console.log("No tokens found");
    return null;
  }

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.setSession({
      access_token: accessToken.value,
      refresh_token: refreshToken.value,
    });

    if (error) {
      console.error("Session error:", error.message);
      return null;
    }

    if (!session) {
      console.log("No session found after setting tokens");
      return null;
    }

    // Get user profile/role
    const { data: profile, error: profileError } = await supabase
      .from("profile")
      .select("*") // Select all fields from profile
      .eq("user_id", session.user.id) // Ensure session.user.id is a UUID
      .single();

    if (profileError) {
      console.error("Profile error:", profileError.message);
    }

    // Return the session with the correct structure
    return {
      data: {
        session: {
          ...session,
          user: {
            ...session.user,
            role: profile?.role, // Add role from profile
          },
        },
      },
      error: null,
    } as SessionData;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
