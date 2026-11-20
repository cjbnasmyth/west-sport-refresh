import { Link } from "react-router-dom";
import PageHead from "@/components/PageHead";
import PageShell from "@/components/PageShell";
import { articlesCopy } from "@/content";

const NotFound = () => (
  <PageShell>
    <PageHead title={articlesCopy.notFound.title} path="/404" noindex />
    <section className="pt-36 pb-32 lg:pt-44">
      <div className="container mx-auto max-w-2xl px-4 text-center lg:px-8">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground">{articlesCopy.notFound.title}</h1>
        <p className="mt-6 text-lg text-muted-foreground">{articlesCopy.notFound.body}</p>
        <Link to="/" className="pill-button mt-10 inline-flex">
          {articlesCopy.notFound.homeLabel}
        </Link>
      </div>
    </section>
  </PageShell>
);

export default NotFound;
