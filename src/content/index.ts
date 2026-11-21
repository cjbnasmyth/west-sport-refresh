// All editable site copy and imagery lives in the JSON files in this folder; images live in ./images.
// Components import from here rather than reading the JSON directly so image paths and icon names
// are resolved in one place.
import { Award, Handshake, Megaphone, Target, TrendingUp, Users, Zap, type LucideIcon } from "lucide-react";
import siteJson from "./site.json";
import heroJson from "./hero.json";
import aboutJson from "./about.json";
import servicesJson from "./services.json";
import contactJson from "./contact.json";
import articlesJson from "./articles.json";
import bioJson from "./bio.json";
import { articles as articleList } from "virtual:articles";

// Glob results keyed by path relative to ./images.
const keyed = (modules: Record<string, string>) =>
  Object.fromEntries(Object.entries(modules).map(([path, url]) => [path.replace("./images/", ""), url]));

// Bundled (and hashed) URLs for everything in ./images.
const imageUrls = keyed(
  import.meta.glob<string>("./images/**/*.{png,jpg,jpeg,webp,avif,svg}", { eager: true, import: "default", query: "?url" }),
);

// Accepts "/images/foo.webp" (the form Pages CMS writes, see .pages.yml) or plain "foo.webp".
const imageKey = (name: string) => name.replace(/^\/?(images\/)?/, "");

// Original file, unprocessed. Used for logos, which are small and must stay pixel-crisp.
export const image = (name: string) => {
  const url = imageUrls[imageKey(name)];
  if (!url) throw new Error(`Content image "${name}" not found in src/content/images`);
  return url;
};

// Photos are resized at build time (vite-imagetools) to several widths as WebP at quality 80, so each
// browser downloads the smallest one that's still sharp for its screen. Never enlarged past the
// original. The originals in ./images are left untouched. Logos are excluded.
const photoSrcsets = keyed(
  import.meta.glob<string>(["./images/**/*.{jpg,jpeg,png,webp,avif}", "!./images/logo/**"], {
    eager: true,
    import: "default",
    query: "?w=400;800;1200;1600;2000&format=webp&quality=80&as=srcset",
  }),
);
const photoFallbacks = keyed(
  import.meta.glob<string>(["./images/**/*.{jpg,jpeg,png,webp,avif}", "!./images/logo/**"], {
    eager: true,
    import: "default",
    query: "?w=1200&format=webp&quality=80",
  }),
);

export type Photo = { src: string; srcset: string };

// `src` (1200px wide) is also what link previews use for og:image.
export const photo = (name: string): Photo => {
  const key = imageKey(name);
  if (!photoSrcsets[key]) throw new Error(`Content photo "${name}" not found in src/content/images`);
  return { src: photoFallbacks[key], srcset: photoSrcsets[key] };
};

// Icons referenced by name in the JSON. Add new lucide icons here to make them available (and to the
// icon lists in .pages.yml). Icons are hidden in the CMS, so items added there have no icon and get
// the section's fallback.
const icons: Record<string, LucideIcon> = {
  award: Award,
  handshake: Handshake,
  megaphone: Megaphone,
  target: Target,
  "trending-up": TrendingUp,
  users: Users,
  zap: Zap,
};

const icon = (name: string | undefined, fallback: LucideIcon) => {
  if (!name) return fallback;
  const Icon = icons[name];
  if (!Icon) throw new Error(`Unknown content icon "${name}"; register it in src/content/index.ts`);
  return Icon;
};

// Published articles (drafts and future-dated ones are filtered out at build time), newest first.
export const articles = articleList.map((a) => ({ ...a, cover: a.cover ? photo(a.cover) : null }));
export type Article = (typeof articles)[number];

export const site = {
  ...siteJson,
  logos: Object.fromEntries(Object.entries(siteJson.logos).map(([k, v]) => [k, image(v)])) as Record<
    keyof typeof siteJson.logos,
    string
  >,
};

export const hero = { ...heroJson, image: { ...heroJson.image, ...photo(heroJson.image.src) } };

export const about = {
  ...aboutJson,
  stats: aboutJson.stats.map((s) => ({ ...s, icon: icon(s.icon, Award) })),
  image: { ...aboutJson.image, ...photo(aboutJson.image.src) },
};

export const services = {
  ...servicesJson,
  backgroundImage: photo(servicesJson.backgroundImage),
  items: servicesJson.items.map((s) => ({ ...s, icon: icon(s.icon, Target) })),
};

export const bio = { ...bioJson, image: { ...bioJson.image, ...photo(bioJson.image.src) } };

export const contact = contactJson;
export const articlesCopy = articlesJson;
