import type { CollectionEntry } from "astro:content";
// CollectionEntry for Blog and Series
// type CollectionEntry<T extends keyof typeof collections> = {
//   url: string;
//   data: typeof collections[T]["schema"];
// };

// This function is used in src\pages\index.astro
// to get the list of posts to display on the home page.
const getSortedPosts = (posts: CollectionEntry<"blog" & "series">[]) =>
  posts
    .filter(({ data }) => !data.draft)
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.pubDatetime).getTime() / 1000) -
        Math.floor(new Date(a.data.pubDatetime).getTime() / 1000)
    );

export default getSortedPosts;
