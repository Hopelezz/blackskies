// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY; 


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file"
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey,{
  auth: {
    flowType: "pkce",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: "public",
  },
});

async function getCurrentUserProfile() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error("Error fetching session:", sessionError?.message);
    return null;
  }

  const userId = session.user.id; // Use session.user.id directly

  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", userId) // Ensure this matches the column in your profile table
    .single();

  if (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }

  return profile;
}

const profile = await getCurrentUserProfile();
console.log("Current user's profile:", profile);
