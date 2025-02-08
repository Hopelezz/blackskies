// src/types/post.ts
export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    description?: string;
    author_id: string;
    published: boolean;
    created_at: string;
    updated_at: string;
    tags: string[];
    profile?: {
      username: string;
      full_name: string;
    };
  }