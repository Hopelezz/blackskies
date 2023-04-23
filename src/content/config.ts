import { defineCollection } from "astro:content";
import { blogSchema } from "./_schemas";
// import { seriesSchema } from "./_schemas";

const blogCollection = defineCollection({
  schema: blogSchema,
});

const seriesCollection = defineCollection({
  schema: blogSchema, // change this to seriesSchema when it's ready
});

export const collections = { 
  'blog': blogCollection,
  'series': seriesCollection,
 };
