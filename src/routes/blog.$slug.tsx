import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogArticle } from "@/components/BlogArticle";
import { getPostBySlug, blogPosts } from "@/lib/blog-data";
import { siteConfig } from "@/lib/site-config";

const BASE_URL = "https://siqueirahigienizacao.lovable.app";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Artigo não encontrado" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.post;
    const url = `${BASE_URL}/blog/${params.slug}`;
    return {
      meta: [
        { title: p.title },
        { name: "description", content: p.description },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: p.cover },
        { property: "article:published_time", content: p.publishedAt },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: p.cover },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: p.h1,
            description: p.description,
            image: p.cover,
            datePublished: p.publishedAt,
            author: { "@type": "Organization", name: siteConfig.brandName },
            publisher: {
              "@type": "Organization",
              name: siteConfig.brandName,
            },
            mainEntityOfPage: url,
          }),
        },
        ...(p.faq && p.faq.length > 0
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: p.faq.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              },
            ]
          : []),
      ],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-bold">Artigo não encontrado</h1>
        <p className="mt-2 text-muted-foreground">
          Este post pode ter sido movido ou removido.
        </p>
        <a href="/blog" className="mt-4 inline-block text-primary underline">
          Ver todos os artigos
        </a>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-bold">Erro ao carregar</h1>
        <a href="/blog" className="mt-4 inline-block text-primary underline">
          Voltar para o blog
        </a>
      </div>
    </div>
  ),
});

// Silence unused import warning while keeping the export available
void blogPosts;

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  return <BlogArticle post={post} />;
}
