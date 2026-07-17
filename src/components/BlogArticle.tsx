import { Link } from "@tanstack/react-router";
import { blogPosts, type BlogPost } from "@/lib/blog-data";
import { siteConfig, whatsappLink } from "@/lib/site-config";

export function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              {siteConfig.logoLetter}
            </span>
            <span className="hidden sm:inline">{siteConfig.brandName}</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/blog" className="hover:text-primary">
              Blog
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
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <img
          src={post.cover}
          alt={post.title}
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-16 -mt-24 relative">
        <div className="rounded-2xl bg-card p-6 shadow-lg sm:p-10">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
              {post.category}
            </span>
            <span>· {post.readingTime} de leitura</span>
            <time dateTime={post.publishedAt}>
              ·{" "}
              {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>

          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {post.h1}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>

          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-foreground/90">
            {post.blocks.map((b, i) => {
              if (b.type === "p") return <p key={i}>{b.text}</p>;
              if (b.type === "h2")
                return (
                  <h2 key={i} className="mt-8 text-2xl font-bold tracking-tight">
                    {b.text}
                  </h2>
                );
              if (b.type === "h3")
                return (
                  <h3 key={i} className="mt-6 text-xl font-semibold">
                    {b.text}
                  </h3>
                );
              if (b.type === "ul")
                return (
                  <ul key={i} className="ml-5 list-disc space-y-2">
                    {b.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                );
              if (b.type === "ol")
                return (
                  <ol key={i} className="ml-5 list-decimal space-y-2">
                    {b.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ol>
                );
              if (b.type === "quote")
                return (
                  <blockquote
                    key={i}
                    className="border-l-4 border-primary bg-primary/5 px-4 py-3 italic text-foreground/80"
                  >
                    {b.text}
                  </blockquote>
                );
              return null;
            })}
          </div>

          {post.faq && post.faq.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold tracking-tight">Perguntas frequentes</h2>
              <div className="mt-4 divide-y divide-border rounded-xl border border-border">
                {post.faq.map((f, i) => (
                  <details key={i} className="group px-4 py-3">
                    <summary className="cursor-pointer list-none font-semibold">
                      {f.q}
                      <span className="float-right transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 text-center sm:p-8">
            <h3 className="text-xl font-bold sm:text-2xl">
              Quer um orçamento em menos de 2 minutos?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Higienização em domicílio em {siteConfig.city}/{siteConfig.state} · secagem rápida
              · produtos seguros
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/blog" className="text-sm font-medium text-primary hover:underline">
            ← Voltar para o blog
          </Link>
        </div>
      </article>
    </div>
  );
}
