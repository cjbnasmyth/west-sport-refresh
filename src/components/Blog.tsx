import { ArrowUpRight, Play } from "lucide-react";
import posts from "@/data/linkedin-posts.json";
import { LINKEDIN_URL } from "@/lib/site";

// Posts are snapshotted from LinkedIn at build time by scripts/fetch-linkedin-posts.mjs.
type Post = {
  urn: string;
  url: string;
  type: "article" | "video" | "post";
  title: string;
  excerpt: string;
  author: string | null;
  image: string | null;
  date: string;
};

const TYPE_LABEL = { article: "Article", video: "Video", post: "Post" } as const;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

const PostCard = ({ post }: { post: Post }) => (
  <a
    href={post.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-deep focus-visible:ring-offset-2"
  >
    <div className="relative aspect-[16/9] overflow-hidden bg-navy">
      {post.image ? (
        <img
          src={post.image}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
        />
      ) : (
        <div className="grid h-full place-items-center">
          <img src={`${import.meta.env.BASE_URL}logo/mark.png`} alt="" className="w-16 opacity-90" />
        </div>
      )}
      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy backdrop-blur-sm">
        {TYPE_LABEL[post.type]}
      </span>
      {post.type === "video" && (
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-navy shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play aria-hidden="true" className="ml-0.5 h-5 w-5 fill-current" />
          </span>
        </span>
      )}
    </div>

    <div className="flex flex-1 flex-col p-6">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {post.author && <> · {post.author}</>}
      </p>
      <h3 className="mb-3 line-clamp-3 text-xl font-bold leading-snug text-foreground">{post.title}</h3>
      {post.excerpt && <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>}
      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-coral-deep">
        Read on LinkedIn
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
        <span className="sr-only">(opens in a new tab)</span>
      </span>
    </div>
  </a>
);

const Blog = () => {
  return (
    <section id="blog" className="py-20 lg:py-32 bg-secondary/40">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p data-reveal="up" className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Insights</p>
          <h2 data-reveal="heading" className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
            Direct from LinkedIn
          </h2>
          <p data-reveal="up" className="text-lg text-muted-foreground mt-4">
            Perspectives on sports media, rights and sponsorship, shared by our team on LinkedIn.
          </p>
          <div data-reveal="up">
            <a
              className="pill-button mt-8 inline-flex items-center gap-2"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow on LinkedIn
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {posts.length === 0 ? (
          import.meta.env.DEV && (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              No posts yet. Set <code className="px-2 py-1 rounded bg-secondary text-foreground">VITE_LINKEDIN_POST_URNS</code>{" "}
              and run <code>npm run posts</code>.
            </p>
          )
        ) : (
          <ul data-reveal="stagger" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(posts as Post[]).map((post) => (
              <li key={post.urn}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Blog;
