import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface LinkedInPostsResponse {
  posts: string[];
  profileUrl?: string;
  message?: string;
  error?: string;
}

const fetchLinkedInPosts = async (profileUrl: string): Promise<LinkedInPostsResponse> => {
  const response = await fetch(`${API_URL}/api/linkedin/posts?url=${encodeURIComponent(profileUrl)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch LinkedIn posts");
  }
  return response.json();
};

const Blog = () => {
  const linkedInProfileUrl =
    import.meta.env.VITE_LINKEDIN_PROFILE_URL || "https://www.linkedin.com/in/your-profile";

  const { data, isLoading, error } = useQuery({
    queryKey: ["linkedin-posts", linkedInProfileUrl],
    queryFn: () => fetchLinkedInPosts(linkedInProfileUrl),
    enabled: !!linkedInProfileUrl && linkedInProfileUrl !== "https://www.linkedin.com/in/your-profile",
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    retry: 1,
  });

  const postUrns = data?.posts || [];
  const displayProfileUrl = data?.profileUrl || linkedInProfileUrl;

  return (
    <section id="blog" className="py-20 lg:py-32 bg-secondary/40">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Insights</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
            Direct from LinkedIn
          </h2>
          <p className="text-lg text-muted-foreground mt-4">
            Stay up-to-date with the latest thoughts, industry POVs, and wins we share on LinkedIn. The cards
            below automatically embed the specified posts so they stay synced with your live profile.
          </p>
          <a
            className="pill-button mt-8 inline-flex items-center gap-2"
            href={displayProfileUrl}
            target="_blank"
            rel="noreferrer"
          >
            View on LinkedIn
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <span className="ml-3 text-muted-foreground">Fetching latest posts from LinkedIn...</span>
          </div>
        )}

        {error && (
          <div className="mt-10 text-center">
            <p className="text-destructive mb-2">Failed to fetch LinkedIn posts</p>
            <p className="text-sm text-muted-foreground">
              Make sure the backend API is running and <code className="px-2 py-1 rounded bg-secondary text-foreground">VITE_LINKEDIN_PROFILE_URL</code> is set correctly.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              You can also manually provide URNs using <code className="px-2 py-1 rounded bg-secondary text-foreground">VITE_LINKEDIN_POST_URNS</code>
            </p>
          </div>
        )}

        {!isLoading && !error && postUrns.length === 0 && (
          <div className="mt-10 text-center text-muted-foreground">
            <p className="mb-2">No posts found.</p>
            <p className="text-sm">
              Make sure <code className="px-2 py-1 rounded bg-secondary text-foreground">VITE_LINKEDIN_PROFILE_URL</code> is set to a valid LinkedIn profile URL in your <code>.env</code> file.
            </p>
            <p className="text-xs mt-2">
              Alternatively, you can manually provide URNs using <code className="px-2 py-1 rounded bg-secondary text-foreground">VITE_LINKEDIN_POST_URNS</code>
            </p>
          </div>
        )}

        {!isLoading && !error && postUrns.length > 0 && (
          <div className="grid gap-10 lg:grid-cols-2">
            {postUrns.map((urn) => (
            <article key={urn} className="card-surface p-4 lg:p-6">
              <div className="text-sm text-muted-foreground mb-3 font-medium tracking-[0.2em]">
                LINKEDIN POST
              </div>
              <div className="rounded-3xl overflow-hidden border border-border bg-white">
                <iframe
                  src={`https://www.linkedin.com/embed/feed/update/${urn}`}
                  height="550"
                  className="w-full"
                  frameBorder="0"
                  allowFullScreen
                  title={`LinkedIn post ${urn}`}
                />
              </div>
            </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;

