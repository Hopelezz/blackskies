// src/types/props.ts
import type { SessionData } from "./supabase";

export interface AdminLayoutProps {
  title: string;
  session: SessionData;
}

export interface PostsTableProps {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    published: boolean;
    created_at: string;
    // Add other post properties
  }>;
  showAll?: boolean;
}

export interface AuthFormProps {
  type: "signin" | "register";
}

//Email and Role
export interface NavbarProps {
  email: string;
  role: string;
}
// Add other component prop interfaces as needed

export interface PostEditorProps {
  post: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    published: boolean;
  };
}
