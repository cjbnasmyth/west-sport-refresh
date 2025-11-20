import React from "react";

const manualUrns = import.meta.env.VITE_LINKEDIN_POST_URNS?.split(',').filter(Boolean) || [];


const Blog = () => {
  const linkedInProfileUrl = import.meta.env.VITE_LINKEDIN_PROFILE_URL || "https://www.linkedin.com/in/your-profile";
  const postUrns = manualUrns;

  const ResponsiveIframe = ({ src, title }: { src: string; title: string }) => {
    const wrapRef = React.useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = React.useState<number>(720);

    React.useEffect(() => {
      if (!wrapRef.current) return;
      const ro = new ResizeObserver((entries) => {
        const w = Math.round(entries[0].contentRect.width);
        // Use different ratios depending on available width to avoid excessive whitespace
        let ratio = 0.9;
        if (w >= 1200) ratio = 0.5; // large desktop: shallower ratio
        else if (w >= 900) ratio = 0.65; // laptop
        else if (w >= 600) ratio = 0.85; // tablet
        else ratio = 1.0; // phones: keep tall

        const h = Math.max(360, Math.min(1200, Math.round(w * ratio)));
        setHeight(h);
      });
      ro.observe(wrapRef.current);
      return () => ro.disconnect();
    }, []);

    return (
      <div ref={wrapRef} className="w-full max-w-3xl">
        <iframe
          src={src}
          className="w-full block rounded-3xl border border-border bg-white"
          frameBorder="0"
          allowFullScreen
          title={title}
          style={{ height }}
        />
      </div>
    );
  };

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
            href={linkedInProfileUrl}
            target="_blank"
            rel="noreferrer"
          >
            View on LinkedIn
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        {postUrns.length === 0 ? (
          <div className="mt-10 text-center text-muted-foreground">
            <p className="mb-2">No posts found.</p>
            <p className="text-sm">
              Make sure <code className="px-2 py-1 rounded bg-secondary text-foreground">VITE_LINKEDIN_POST_URNS</code> is set to a comma-separated list of post URNs in your <code>.env</code> file.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10 items-center">
            {postUrns.map((urn) => (
              <ResponsiveIframe
                key={urn}
                src={`https://www.linkedin.com/embed/feed/update/${urn}`}
                title={`LinkedIn post ${urn}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;

