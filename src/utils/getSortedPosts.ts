import type { CollectionEntry } from "astro:content";

interface BlogPost {
  author: string;
  pubDatetime: string;
  title: string;
  postSlug: string;
  featured?: boolean;
  draft?: boolean;
  tags: string[];
  ogImage?: string;
  description: string;
}

const getSortedPosts = (
  posts: Array<CollectionEntry<"blog"> | CollectionEntry<"series">>
) =>
  posts
    .filter(
      ({ collection, data: post }) => collection === "blog" && !post.draft
    ) // Filter out draft blog posts
    .sort(
      (a, b) =>
        new Date(b.data.pubDatetime).getTime() - // Convert publication date of post b to a timestamp
        new Date(a.data.pubDatetime).getTime() // Convert publication date of post a to a timestamp
    ); // Subtract to get the difference in milliseconds

export default getSortedPosts;
