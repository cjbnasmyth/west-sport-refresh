import { Head } from "vite-react-ssg";
import { site } from "@/content";

type Props = {
  title?: string;
  description?: string;
  /** Path of this page, e.g. "/articles/". Used for the canonical URL. */
  path: string;
  /** Image URL as bundled (e.g. "/assets/cover-123.webp"). */
  image?: string | null;
  type?: "website" | "article";
  noindex?: boolean;
};

// Per-page <head> tags, written into each pre-rendered page so search engines and link previews see them.
const PageHead = ({ title, description = site.description, path, image, type = "website", noindex }: Props) => {
  const fullTitle = title ? `${title} | ${site.name}` : site.title;
  const url = new URL(path, site.url).href;
  const imageUrl = image ? new URL(image, site.url).href : null;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta name="twitter:card" content={imageUrl ? "summary_large_image" : "summary"} />
      {noindex && <meta name="robots" content="noindex" />}
    </Head>
  );
};

export default PageHead;
