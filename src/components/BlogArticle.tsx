import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  getAdjacentPosts,
  getRelatedPosts,
  type BlogPost,
} from "@/lib/blog-data";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { track } from "@/lib/analytics";

const BASE_URL = "https://siqueirahigienizacao.lovable.app";

type SharePlacement = "top" | "bottom";

function ShareButtons({
  post,
  placement,
}: {
  post: BlogPost;
  placement: SharePlacement;
}) {
  const url = `${BASE_URL}/blog/${post.slug}`;
  const text = `${post.title} — ${siteConfig.brandName}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const items: Array<{
    name: "whatsapp" | "facebook" | "x";
    label: string;
    href: string;
    className: string;
    icon: React.ReactNode;
  }> = [
    {
      name: "whatsapp",
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      className: "bg-[#25D366] text-white hover:opacity-90",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .2 5.3.2 11.85c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.86 11.86 0 0 0 5.65 1.44h.01c6.55 0 11.85-5.3 11.85-11.85 0-3.17-1.23-6.15-3.39-8.43ZM12.06 21.5h-.01a9.63 9.63 0 0 1-4.91-1.35l-.35-.21-3.8 1 1.02-3.7-.23-.38a9.6 9.6 0 0 1-1.47-5.11c0-5.31 4.32-9.63 9.65-9.63 2.58 0 5 1 6.82 2.82a9.57 9.57 0 0 1 2.83 6.82c0 5.31-4.32 9.64-9.55 9.64Zm5.28-7.22c-.29-.14-1.71-.84-1.97-.93-.26-.1-.46-.14-.65.14-.19.29-.74.93-.91 1.12-.17.19-.33.21-.62.07-.29-.14-1.22-.45-2.32-1.43-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.44.13-.58.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.65-1.56-.89-2.14-.23-.56-.47-.48-.65-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.4s1.02 2.78 1.16 2.97c.14.19 2 3.05 4.85 4.28.68.29 1.2.46 1.61.59.68.22 1.29.19 1.78.11.54-.08 1.71-.7 1.95-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.19-.55-.33Z" />
        </svg>
      ),
    },
    {
      name: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: "bg-[#1877F2] text-white hover:opacity-90",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
        </svg>
      ),
    },
    {
      name: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      className: "bg-black text-white hover:opacity-90",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.79l-4.71-6.16L5.4 22H2.64l6.98-7.98L1.5 2h6.96l4.25 5.62L18.24 2Zm-1.19 18.4h1.85L7.03 3.5H5.05l12 16.9Z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={
        placement === "top"
          ? "mt-6 flex flex-wrap items-center gap-2"
          : "mt-8 flex flex-wrap items-center gap-2 border-t border-border pt-6"
      }
    >
      <span className="mr-1 text-xs font-medium text-muted-foreground">
        Compartilhar:
      </span>
      {items.map((it) => (
        <a
          key={it.name}
          href={it.href}
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            track("share_click", {
              network: it.name,
              slug: post.slug,
              placement,
            })
          }
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${it.className}`}
          aria-label={`Compartilhar no ${it.label}`}
        >
          {it.icon}
          <span>{it.label}</span>
        </a>
      ))}
    </div>
  );
}

export function BlogArticle({ post }: { post: BlogPost }) {
  const related = getRelatedPosts(post.slug, 3);
  const { prev, next } = getAdjacentPosts(post.slug);

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

          <ShareButtons post={post} placement="top" />

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

          <ShareButtons post={post} placement="bottom" />

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

        {/* Prev / Next */}
        {(prev || next) && (
          <nav
            aria-label="Navegação entre artigos"
            className="mt-10 grid gap-4 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                to="/blog/$slug"
                params={{ slug: prev.slug }}
                className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/50 hover:shadow-md"
              >
                <span className="text-xs font-medium text-muted-foreground">
                  ← Artigo anterior
                </span>
                <h3 className="mt-1 line-clamp-2 text-base font-semibold group-hover:text-primary">
                  {prev.h1}
                </h3>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
            {next ? (
              <Link
                to="/blog/$slug"
                params={{ slug: next.slug }}
                className="group rounded-2xl border border-border bg-card p-5 text-right transition hover:border-primary/50 hover:shadow-md"
              >
                <span className="text-xs font-medium text-muted-foreground">
                  Próximo artigo →
                </span>
                <h3 className="mt-1 line-clamp-2 text-base font-semibold group-hover:text-primary">
                  {next.h1}
                </h3>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
          </nav>
        )}

        {related.length > 0 && (
          <section className="mt-12" aria-labelledby="related-posts">
            <h2 id="related-posts" className="text-2xl font-bold tracking-tight">
              Continue lendo
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecionados por categoria e tema, sem repetir o que você acabou de ler
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={r.cover}
                      alt={r.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                      {r.category}
                    </span>
                    <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug group-hover:text-primary">
                      {r.h1}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {r.excerpt}
                    </p>
                    <span className="mt-3 inline-block text-xs font-medium text-primary">
                      Ler artigo →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 text-center">
          <Link to="/blog" className="text-sm font-medium text-primary hover:underline">
            ← Voltar para o blog
          </Link>
        </div>
      </article>
    </div>
  );
}
