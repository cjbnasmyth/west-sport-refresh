import { Link } from "react-router-dom";
import ArticleCard from "@/components/ArticleCard";
import { articles, articlesCopy } from "@/content";

const LATEST_COUNT = 3;

// Homepage section: the newest articles, linking through to /articles/.
const Articles = () => {
  return (
    <section id="articles" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p data-reveal="up" className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">
            {articlesCopy.eyebrow}
          </p>
          <h2 data-reveal="heading" className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
            {articlesCopy.title}
          </h2>
          <p data-reveal="up" className="text-lg text-muted-foreground mt-4">
            {articlesCopy.intro}
          </p>
        </div>

        {articles.length === 0 ? (
          <p data-reveal="up" className="text-center text-muted-foreground">
            {articlesCopy.index.empty}
          </p>
        ) : (
          <>
            <ul data-reveal="stagger" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, LATEST_COUNT).map((article) => (
                <li key={article.slug}>
                  <ArticleCard article={article} />
                </li>
              ))}
            </ul>

            <div data-reveal="up" className="mt-12 text-center">
              <Link to="/articles/" className="pill-button inline-flex items-center gap-2">
                {articlesCopy.viewAllLabel}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Articles;
