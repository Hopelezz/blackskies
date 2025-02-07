// src/utils/auth.ts
import type { AstroGlobal } from "astro";
import type { SessionData } from "../types/supabase";
import { supabase } from "../lib/supabase";

export async function getSession(Astro: AstroGlobal) {
  const accessToken = Astro.cookies.get("sb-access-token");
  const refreshToken = Astro.cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) {
    return null;
  }

  try {
    // First try to get the user with the current access token
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken.value);

    if (!userError && user) {
      // If access token is still valid, return the session
      return {
        data: {
          session: {
            access_token: accessToken.value,
            refresh_token: refreshToken.value,
            user
          }
        },
        error: null
      } as SessionData;
    }

    // If access token is invalid, try to refresh
    const { data: { session }, error: refreshError } = await supabase.auth.refreshSession({
      refresh_token: refreshToken.value
    });

    if (refreshError || !session) {
      // If refresh fails, clear cookies and return null
      Astro.cookies.delete("sb-access-token", { path: "/" });
      Astro.cookies.delete("sb-refresh-token", { path: "/" });
      return null;
    }

    // Update cookies with new tokens
    Astro.cookies.set("sb-access-token", session.access_token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });
    
    Astro.cookies.set("sb-refresh-token", session.refresh_token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });

    return {
      data: { session },
      error: null
    } as SessionData;

  } catch (error) {
    console.error("Auth error:", error);
    // Clear cookies on error
    Astro.cookies.delete("sb-access-token", { path: "/" });
    Astro.cookies.delete("sb-refresh-token", { path: "/" });
    return null;
  }
}