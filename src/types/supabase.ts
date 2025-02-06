// src/types/supabase.ts
export interface SupabaseUser {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmation_sent_at: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  identities: any[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  user: Record<string, any>;
  token_type: string;
  expires_in: number;
  expires_at: number;
}

export interface SessionData {
  data: {
    session: {
      user: SupabaseUser;
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
      expires_at: number;
    };
  };
  error: null | any;
}

// src/types/auth-types.ts
export interface UserSession {
  data: {
    session: {
      user: {
        id: string;
        aud: string;
        role: string;
        email: string;
        email_confirmed_at: string;
        phone: string;
        confirmation_sent_at: string;
        confirmed_at: string;
        last_sign_in_at: string;
        app_metadata: Record<string, any>;
        user_metadata: Record<string, any>;
        identities: any[];
        created_at: string;
        updated_at: string;
        is_anonymous: boolean;
      };
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
      expires_at: number;
    };
  };
  error: null | any;
}

// src/types/supabase-types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          author_id: string;
          published: boolean;
          created_at: string;
          updated_at: string;
          tags: string[];
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          author_id: string;
          published?: boolean;
          created_at?: string;
          tags?: string[];
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          author_id?: string;
          published?: boolean;
          updated_at?: string;
          tags?: string[];
        };
      };
      profile: {
        Row: {
          id: number;
          user_id: string;
          username: string;
          full_name: string | null;
          email: string;
          role: string;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          user_id?: string;
          username?: string;
          full_name?: string | null;
          email?: string;
          role?: string;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          username?: string;
          full_name?: string | null;
          email?: string;
          role?: string;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_revisions: {
        Row: {
          id: string;
          post_id: string;
          content: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          content: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          content?: string;
          created_by?: string;
          created_at?: string;
        };
      };
    };
  };
}
