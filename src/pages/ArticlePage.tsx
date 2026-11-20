import { Link, useLoaderData, useParams, type LoaderFunctionArgs } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { loaders } from "virtual:articles";
import PageHead from "@/components/PageHead";
import PageShell from "@/components/PageShell";
import { articles, articlesCopy } from "@/content";
import { formatDate } from "@/lib/format";

// Runs at build time; the browser gets the result from the pre-rendered page (or vite-react-ssg's
// data manifest when navigating client-side), so the Markdown never reaches the client.
export async function loader({ params }: LoaderFunctionArgs) {
  const load = params.slug ? loaders[params.slug] : undefined;
  if (!load) throw new Response("Not found", { status: 404 });
  const { html } = await load();
  return { html };
}

const ArticlePage = () => {
  const { slug } = useParams();
  const { html } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const index = articles.findIndex((a) => a.slug === slug);
  const article = articles[index];
  // Newest first, so the "next" (newer) article is the one before this in the list.
  const newer = articles[index - 1];
  const older = articles[index + 1];

  return (
    <PageShell>
      <PageHead
        title={article.title}
        description={article.excerpt || undefined}
        path={`/articles/${article.slug}/`}
        image={article.cover}
        type="article"
      />
      <article className="pt-36 pb-20 lg:pt-44 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <header className="max-w-3xl mx-auto">
            <Link
              to="/articles/"
              className="mb-8 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-deep focus-visible:ring-offset-2"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              {articlesCopy.article.backLabel}
            </Link>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              <time dateTime={article.date}>{formatDate(article.date)}</time> · {article.readingMinutes}{" "}
              {articlesCopy.readingTimeLabel}
              {article.author && <> · {article.author}</>}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-foreground">
              {article.title}
            </h1>
            {article.excerpt && <p className="mt-6 text-xl leading-relaxed text-muted-foreground">{article.excerpt}</p>}
          </header>

          {article.cover && (
            <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl shadow-xl">
              <img
                src={article.cover}
                alt={article.coverAlt}
                className="aspect-[16/9] w-full object-cover"
                {...{ fetchpriority: "high" }}
              />
            </div>
          )}

          <div
            className="prose prose-lg mx-auto mt-12 max-w-3xl prose-headings:font-serif prose-headings:text-foreground prose-a:text-coral-deep prose-a:underline-offset-4 prose-strong:text-foreground prose-blockquote:border-coral prose-img:rounded-xl"
            // Rendered from the editor's Markdown at build time (scripts/vite-plugin-articles.mjs).
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {(newer || older) && (
            <nav aria-label="More articles" className="mx-auto mt-16 grid max-w-3xl gap-4 border-t border-border pt-8 sm:grid-cols-2">
              {older ? (
                <Link to={`/articles/${older.slug}/`} className="group rounded-xl p-4 transition-colors hover:bg-secondary">
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
                    {articlesCopy.article.previousLabel}
                  </span>
                  <span className="mt-2 block font-serif text-lg font-bold text-foreground">{older.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link
                  to={`/articles/${newer.slug}/`}
                  className="group rounded-xl p-4 text-right transition-colors hover:bg-secondary"
                >
                  <span className="flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    {articlesCopy.article.nextLabel}
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </span>
                  <span className="mt-2 block font-serif text-lg font-bold text-foreground">{newer.title}</span>
                </Link>
              )}
            </nav>
          )}
        </div>
      </article>
    </PageShell>
  );
};

export default ArticlePage;
