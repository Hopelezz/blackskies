import type { CollectionEntry } from "astro:content";

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
    );

export default getSortedPosts;
