import { createFileRoute, Link } from "@tanstack/react-router";
import { blogPosts } from "@/lib/blog-data";
import { siteConfig, whatsappLink } from "@/lib/site-config";

const BASE_URL = "https://siqueirahigienizacao.lovable.app";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Dicas de higienização de sofá, colchão e carro" },
      {
        name: "description",
        content:
          "Guias práticos sobre higienização de sofá, colchão, tapete e veículos em São Luís/MA. Como limpar em casa, preços, benefícios e diferenças técnicas.",
      },
      { property: "og:title", content: "Blog Siqueira Higienização" },
      {
        property: "og:description",
        content: "Guias práticos sobre higienização de sofá, colchão, tapete e veículos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}/blog` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/blog` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `Blog ${siteConfig.brandName}`,
          url: `${BASE_URL}/blog`,
          blogPost: blogPosts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.h1,
            url: `${BASE_URL}/blog/${p.slug}`,
            datePublished: p.publishedAt,
            image: p.cover,
            description: p.description,
          })),
        }),
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              {siteConfig.logoLetter}
            </span>
            <span className="hidden sm:inline">{siteConfig.brandName}</span>
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            Orçamento no WhatsApp
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Blog
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Dicas de higienização
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Guias práticos sobre sofá, colchão, tapete e veículos — feito por quem higieniza
            profissionalmente em {siteConfig.city}/{siteConfig.state}.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg"
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={post.cover}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                    {post.category}
                  </span>
                  <span>· {post.readingTime}</span>
                </div>
                <h2 className="mt-3 text-xl font-bold leading-snug group-hover:text-primary">
                  {post.h1}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-primary">
                  Ler artigo →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
