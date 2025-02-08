import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import remarkToc from "remark-toc";
import react from "@astrojs/react";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import netlify from "@astrojs/netlify"; 

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: "server",
  integrations: [
    tailwind({
      config: {
        // applyBaseStyles: false,
      },
    }),
    react(),
    sitemap(),
    mdx(),
    netlify(),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
      langs: [],
      transformers: [{
          pre(node) {
              node.properties.className = [
                  ...(node.properties.className || []),
                  'code-block'
              ];
              return node;
          }
      }]
    },
    extendDefaultPlugins: true,
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
      include: ["marked", "flowbite"],
    },
  },
});
