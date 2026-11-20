import ArticleCard from "@/components/ArticleCard";
import PageHead from "@/components/PageHead";
import PageShell from "@/components/PageShell";
import { articles, articlesCopy } from "@/content";

const ArticlesIndex = () => (
  <PageShell>
    <PageHead title={articlesCopy.index.title} description={articlesCopy.index.intro} path="/articles/" />
    <section className="pt-36 pb-20 lg:pt-44 lg:pb-32">
      <div className="container mx-auto px-4 lg:px-8">
        <header className="max-w-3xl mx-auto text-center mb-16">
          <h1 data-reveal="heading" className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight">
            {articlesCopy.index.title}
          </h1>
          <p data-reveal="up" className="text-lg text-muted-foreground mt-4">
            {articlesCopy.index.intro}
          </p>
        </header>

        {articles.length === 0 ? (
          <p className="text-center text-muted-foreground">{articlesCopy.index.empty}</p>
        ) : (
          <ul data-reveal="stagger" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  </PageShell>
);

export default ArticlesIndex;
