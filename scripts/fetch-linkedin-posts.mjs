// Snapshots LinkedIn posts into src/data/linkedin-posts.json so the Insights section renders branded
// cards instead of LinkedIn's iframes (no cookie banner, no third-party scripts, no layout shift).
//
// Which posts:
//   - VITE_LINKEDIN_POST_URNS set   -> exactly those posts (manual pin/override)
//   - otherwise                     -> the latest VITE_LINKEDIN_POST_COUNT (default 3) posts the
//                                      profile at VITE_LINKEDIN_PROFILE_URL authored itself, read from
//                                      LinkedIn's public (logged-out) profile page
//
// The public profile page isn't an official API and LinkedIn may change it or serve a login wall,
// so every failure falls back to the previously saved posts and the build carries on.
//
// Runs automatically before `npm run build`; run manually with `npm run posts`.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = resolve(root, "src/data/linkedin-posts.json");

const env = { ...loadEnv(process.env.NODE_ENV === "development" ? "development" : "production", root, "VITE_"), ...process.env };
const pinned = (env.VITE_LINKEDIN_POST_URNS ?? "")
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);
const profileUrl = env.VITE_LINKEDIN_PROFILE_URL?.trim();
const count = Number(env.VITE_LINKEDIN_POST_COUNT) || 3;
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

let previous = [];
try {
  previous = JSON.parse(readFileSync(outFile, "utf8"));
} catch {
  // first run
}

const keepExisting = (reason) => {
  console.warn(`[posts] ${reason}; keeping existing src/data/linkedin-posts.json`);
  process.exit(0);
};

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));

const meta = (html, property) =>
  html.match(new RegExp(`<meta[^>]+(?:property|name)="${property}"[^>]+content="([^"]*)"`))?.[1];

// LinkedIn IDs are snowflakes: the top 41 bits are the creation time in ms.
const dateFromUrn = (urn) => {
  const id = urn.split(":").pop();
  return new Date(Number(BigInt(id) >> 22n)).toISOString();
};

async function fetchPost(urn) {
  const res = await fetch(`https://www.linkedin.com/embed/feed/update/${urn}`, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; 26WestSportSiteBuild/1.0)" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  // og:title looks like "<title or opening line> | <author> | <n> comments"
  const [title, author] = decode(meta(html, "og:title") ?? "").split(" | ");
  const body = html.match(/class="[^"]*attributed-text-segment-list__content[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "";
  const text = decode(body.replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, ""))
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const url = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? `https://www.linkedin.com/feed/update/${urn}`;
  const image = meta(html, "og:image");

  if (!title && !text) throw new Error("no post content found");

  // Articles have a real headline. For ordinary posts og:title is just the opening line (or only
  // hashtags), so derive the headline from the first sentence and use the rest as the excerpt.
  const cleanTitle = (title ?? "").trim();
  const isHeadline = cleanTitle && !/^(#\S+\s*)+$/.test(cleanTitle) && !text.startsWith(cleanTitle.replace(/…$/, ""));
  let headline = cleanTitle;
  let excerpt = text;
  if (!isHeadline) {
    const [first, ...rest] = text.split(/(?<=[.!?:])\s+|\n+/);
    headline = truncate(first ?? cleanTitle, 140);
    excerpt = rest.join(" ").trim();
  }

  return {
    urn,
    url,
    type: image?.includes("/playlist/vid/") ? "video" : isHeadline ? "article" : "post",
    title: headline.replace(/[\s:;,–-]+$/, ""),
    excerpt,
    author: author?.trim() || null,
    image: image ? decode(image) : null,
    date: dateFromUrn(urn),
  };
}

// Reads the logged-out profile page and returns the newest activity the profile authored itself
// ("<name> shared/posted this"), skipping things it only liked, reposted or commented on.
async function discoverLatest(url, limit) {
  const res = await fetch(url, {
    headers: { "User-Agent": BROWSER_UA, "Accept-Language": "en-GB,en;q=0.9" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`profile page returned HTTP ${res.status}`);
  const html = await res.text();

  const own = new Set();
  for (const card of html.split(/class="profile-activity-card\b/).slice(1)) {
    const urn = card.match(/data-semaphore-content-urn="(urn:li:activity:\d+)"/)?.[1];
    const text = decode(card.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
    const action = text.match(/\b(shared|posted|liked|reposted|commented on|celebrated|supports|loves|finds|found)\s+this\b/i)?.[1];
    if (urn && /^(shared|posted)$/i.test(action ?? "")) own.add(urn);
  }
  if (own.size === 0) throw new Error("no authored posts found on the public profile (login wall or layout change?)");

  const newestFirst = [...own].sort((a, b) => (BigInt(b.split(":").pop()) > BigInt(a.split(":").pop()) ? 1 : -1));
  return newestFirst.slice(0, limit);
}

function truncate(s, max) {
  if (s.length <= max) return s;
  return s.slice(0, s.lastIndexOf(" ", max)).replace(/[,;:\s]+$/, "") + "…";
}

let urns = pinned;
if (urns.length) {
  console.log(`[posts] using ${urns.length} pinned post(s) from VITE_LINKEDIN_POST_URNS`);
} else if (!profileUrl) {
  keepExisting("neither VITE_LINKEDIN_POST_URNS nor VITE_LINKEDIN_PROFILE_URL is set");
} else {
  try {
    urns = await discoverLatest(profileUrl, count);
    console.log(`[posts] found latest ${urns.length} post(s) on ${profileUrl}`);
  } catch (err) {
    keepExisting(err.message);
  }
}

const posts = [];
for (const urn of urns) {
  try {
    posts.push(await fetchPost(urn));
    console.log(`[posts] ✓ ${urn}`);
  } catch (err) {
    const cached = previous.find((p) => p.urn === urn);
    if (cached) {
      posts.push(cached);
      console.warn(`[posts] ! ${urn}: ${err.message}; using saved copy`);
    } else {
      console.warn(`[posts] ✗ ${urn}: ${err.message}; skipped`);
    }
  }
}

if (posts.length === 0) keepExisting("no posts could be fetched");

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(posts, null, 2) + "\n");
console.log(`[posts] wrote ${posts.length} post(s) to src/data/linkedin-posts.json`);
