// src/types/roles.ts
export type UserRole = 'admin' | 'editor' | 'author' | 'viewer';

export const ROLE_PERMISSIONS = {
  admin: ['manage_users', 'manage_roles', 'manage_posts', 'publish_posts', 'edit_posts', 'delete_posts', 'view_posts'],
  editor: ['manage_posts', 'publish_posts', 'edit_posts', 'delete_posts', 'view_posts'],
  author: ['create_posts', 'edit_own_posts', 'delete_own_posts', 'view_posts'],
  viewer: ['view_posts']
} as const;