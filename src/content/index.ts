// All editable site copy and imagery lives in the JSON files in this folder; images live in ./images.
// Components import from here rather than reading the JSON directly so image paths and icon names
// are resolved in one place.
import { Award, Handshake, Megaphone, Target, TrendingUp, Users, Zap, type LucideIcon } from "lucide-react";
import siteJson from "./site.json";
import heroJson from "./hero.json";
import aboutJson from "./about.json";
import servicesJson from "./services.json";
import insightsJson from "./insights.json";
import contactJson from "./contact.json";

// Bundled (and hashed) URLs for everything in ./images, keyed by path relative to that folder.
const imageUrls = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("./images/**/*.{png,jpg,jpeg,webp,avif,svg}", { eager: true, import: "default", query: "?url" }),
  ).map(([path, url]) => [path.replace("./images/", ""), url]),
);

// Accepts "/images/foo.webp" (the form Pages CMS writes, see .pages.yml) or plain "foo.webp".
export const image = (name: string) => {
  const url = imageUrls[name.replace(/^\/?(images\/)?/, "")];
  if (!url) throw new Error(`Content image "${name}" not found in src/content/images`);
  return url;
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

export const site = {
  ...siteJson,
  social: {
    ...siteJson.social,
    linkedin: import.meta.env.VITE_LINKEDIN_PROFILE_URL || siteJson.social.linkedin,
  },
  logos: Object.fromEntries(Object.entries(siteJson.logos).map(([k, v]) => [k, image(v)])) as Record<
    keyof typeof siteJson.logos,
    string
  >,
};

export const hero = { ...heroJson, image: { ...heroJson.image, src: image(heroJson.image.src) } };

export const about = {
  ...aboutJson,
  stats: aboutJson.stats.map((s) => ({ ...s, icon: icon(s.icon, Award) })),
  image: { ...aboutJson.image, src: image(aboutJson.image.src) },
};

export const services = {
  ...servicesJson,
  backgroundImage: image(servicesJson.backgroundImage),
  items: servicesJson.items.map((s) => ({ ...s, icon: icon(s.icon, Target) })),
};

export const insights = insightsJson;
export const contact = contactJson;
