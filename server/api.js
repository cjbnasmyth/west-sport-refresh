import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const LINKEDIN_HOST_PATTERN = /(?:www\.)?linkedin\.com/i;

const sanitizeLinkedInUrl = (rawUrl) => {
  try {
    const url = new URL(rawUrl);
    if (!LINKEDIN_HOST_PATTERN.test(url.hostname)) {
      return null;
    }

    url.hash = "";
    url.search = "";
    // Normalize https://linkedin.com -> https://www.linkedin.com
    if (!url.hostname.startsWith("www.")) {
      url.hostname = `www.${url.hostname}`;
    }
    return url;
  } catch (error) {
    return null;
  }
};

const buildActivityPath = (url) => {
  const pathname = url.pathname.replace(/\/$/, "");
  const lowerPath = pathname.toLowerCase();

  if (lowerPath.includes("/company/") || lowerPath.includes("/school/") || lowerPath.includes("/showcase/")) {
    return `${pathname}/posts/`;
  }

  // Default to personal profile activity
  return `${pathname}/recent-activity/all/`;
};

/**
 * Fetches LinkedIn posts from a profile URL
 * Note: This uses a proxy service to fetch LinkedIn profile data
 * LinkedIn doesn't have a public API for this, so we use a CORS proxy
 */
app.get("/api/linkedin/posts", async (req, res) => {
  try {
    const profileUrl = req.query.url;

    if (!profileUrl) {
      return res.status(400).json({ error: "Profile URL is required" });
    }

    const normalizedUrl = sanitizeLinkedInUrl(profileUrl);

    if (!normalizedUrl) {
      return res.status(400).json({ error: "Invalid LinkedIn profile URL" });
    }

    const activityUrl = `${normalizedUrl.origin}${buildActivityPath(normalizedUrl)}`;

    // Use a CORS proxy to fetch LinkedIn profile
    // Note: This is a workaround since LinkedIn doesn't allow direct CORS requests
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(activityUrl)}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();

    if (!data.contents) {
      return res.status(500).json({ error: "Failed to fetch LinkedIn data" });
    }

    // Parse HTML to extract post URNs
    const html = data.contents;
    const urnMatches = html.match(/urn:li:(?:share|ugcPost):\d+/g) || [];

    // Get unique URNs and limit to 5
    const uniqueUrns = [...new Set(urnMatches)].slice(0, 5);

    if (uniqueUrns.length === 0) {
      return res.json({
        posts: [],
        message: "No posts found. You may need to manually provide URNs in your .env file.",
      });
    }

    res.json({
      posts: uniqueUrns,
      profileUrl: `${normalizedUrl.origin}${normalizedUrl.pathname}`,
    });
  } catch (error) {
    console.error("Error fetching LinkedIn posts:", error);
    res.status(500).json({
      error: "Failed to fetch LinkedIn posts",
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

