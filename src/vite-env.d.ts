/// <reference types="vite/client" />

// Generated from src/content/articles by scripts/vite-plugin-articles.mjs.
declare module "virtual:articles" {
  export type ArticleMeta = {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    cover: string | null;
    coverAlt: string;
    author: string | null;
    readingMinutes: number;
  };
  export const articles: ArticleMeta[];
  export const loaders: Record<string, () => Promise<{ html: string }>>;
}
