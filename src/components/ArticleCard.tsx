import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { articlesCopy, site, type Article } from "@/content";
import { formatDate } from "@/lib/format";
import { articlePath } from "@/lib/links";

// Same card language as the LinkedIn posts in the Insights section, but opens the article on this site.
const ArticleCard = ({ article }: { article: Article }) => (
  <Link
    to={articlePath(article.slug)}
    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-deep focus-visible:ring-offset-2"
  >
    <div className="relative aspect-[16/9] overflow-hidden bg-navy">
      {article.cover ? (
        <img
          src={article.cover.src}
          srcSet={article.cover.srcset}
          sizes="(min-width: 1024px) 420px, (min-width: 768px) 50vw, 100vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
        />
      ) : (
        <div className="grid h-full place-items-center">
          <img src={site.logos.mark} alt="" className="w-16 opacity-90" />
        </div>
      )}
    </div>

    <div className="flex flex-1 flex-col p-6">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        <time dateTime={article.date}>{formatDate(article.date)}</time> · {article.readingMinutes}{" "}
        {articlesCopy.readingTimeLabel}
      </p>
      <h3 className="mb-3 line-clamp-3 text-xl font-bold leading-snug text-foreground">{article.title}</h3>
      {article.excerpt && (
        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
      )}
      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-coral-deep">
        {articlesCopy.readMoreLabel}
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </span>
    </div>
  </Link>
);

export default ArticleCard;
