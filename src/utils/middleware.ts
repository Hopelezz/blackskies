// src/utils/middleware.ts
import type { AstroGlobal } from "astro";
import { getSession } from "./auth";

export async function checkAuth(Astro: AstroGlobal) {
  const session = await getSession(Astro);
  
  if (!session) {
    return Astro.redirect("/admin/signin");
  }
  
  return session;
}