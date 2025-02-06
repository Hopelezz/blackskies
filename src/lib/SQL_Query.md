-- Create profiles table for user management
create table profiles (
id uuid references auth.users on delete cascade primary key,
email text unique,
role text check (role in ('admin', 'user')) default 'user',
created_at timestamp with time zone default timezone('utc'::text, now()) not null,
updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles table
alter table profiles enable row level security;

-- Create posts table for blog posts
create table posts (
id uuid default uuid_generate_v4() primary key,
title text not null,
slug text unique not null,
content text not null,
author_id uuid references profiles(id),
published boolean default false,
featured boolean default false,
tags text[] default '{}',
created_at timestamp with time zone default timezone('utc'::text, now()) not null,
updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for author_id in posts table
create index idx_posts_author_id on posts(author_id);

-- Enable RLS for posts table
alter table posts enable row level security;

-- Create post_revisions table for tracking changes
create table post_revisions (
id uuid default uuid_generate_v4() primary key,
post_id uuid references posts(id) on delete cascade,
content text not null,
created_by uuid references profiles(id),
created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for post_id in post_revisions table
create index idx_post_revisions_post_id on post_revisions(post_id);

-- Enable RLS for post_revisions table
alter table post_revisions enable row level security;
