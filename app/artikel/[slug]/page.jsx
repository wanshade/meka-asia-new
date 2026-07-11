import Link from "next/link";
import { notFound } from "next/navigation";
import {
  artikelPicture,
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
} from "../../../lib/artikel";

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return { title: "Artikel Tidak Ditemukan | Meka Asia Property" };
  }
  return {
    title: `${article.title} | Meka Asia Property`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
      type: "article",
    },
  };
}

function RelatedCard({ article }) {
  const picHtml = artikelPicture({
    mediaKey: article.mediaKey,
    alt: article.imageAlt,
    className: "absolute inset-0 block w-full h-full",
    imgClass: "artikel-card-img w-full h-full object-cover",
    sizes: "(max-width: 640px) 100vw, 33vw",
    loading: "lazy",
    fallbackImage: article.image,
  });

  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="artikel-card group block bg-[#fcf9f3] border border-[#e7ded0] rounded-[10px] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#204130]"
    >
      <div
        className="artikel-card-media relative overflow-hidden bg-[#f6f1e7]"
        style={{ aspectRatio: "4/3" }}
        dangerouslySetInnerHTML={{ __html: picHtml }}
      />
      <div className="p-5 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#c49a4a] text-[10px] tracking-[0.18em] uppercase font-medium">
            {article.category}
          </span>
          <time className="text-[#1f1b13]/50 text-xs" dateTime={String(article.year)}>
            {article.year}
          </time>
        </div>
        <h3 className="pf text-[#1f1b13] text-base font-medium leading-snug line-clamp-3 group-hover:text-[#204130] transition-colors">
          {article.title}
        </h3>
        <span className="artikel-card-link text-[#c49a4a] text-xs font-medium tracking-wide inline-flex items-center gap-1.5 mt-1">
          Baca Selengkapnya <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

export default async function ArtikelDetailPage({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article.slug, 3);
  const heroPic = artikelPicture({
    mediaKey: article.mediaKey,
    alt: article.imageAlt,
    className: "block w-full h-full",
    imgClass: "w-full h-full object-cover",
    sizes: "(max-width: 768px) 100vw, 760px",
    loading: "eager",
    fetchpriority: "high",
    fallbackImage: article.image,
  });

  return (
    <main className="on-light min-h-screen bg-[#fcf9f3] text-[#1f1b13]">
      <header className="border-b border-[#e7ded0] bg-[#fcf9f3]">
        <div
          className="mx-auto flex items-center justify-between gap-4"
          style={{
            maxWidth: 1180,
            padding: "1rem clamp(20px,5vw,84px)",
          }}
        >
          <Link href="/" className="flex items-center" aria-label="Meka Asia home">
            <img
              src="/brand/meka-asia-logo-new.png"
              alt="Meka Asia"
              width={124}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <Link
            href="/artikel"
            className="text-xs font-semibold tracking-wide uppercase text-[#204130] underline underline-offset-4 decoration-[#c49a4a]/50"
          >
            Semua Artikel
          </Link>
        </div>
      </header>

      <article>
        <header
          style={{
            padding: "clamp(40px,7vw,72px) clamp(20px,5vw,84px) 0",
          }}
        >
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            <nav
              aria-label="Breadcrumb"
              className="mb-8 text-xs text-[#1f1b13]/50"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="underline underline-offset-2 hover:text-[#204130]">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/artikel"
                    className="underline underline-offset-2 hover:text-[#204130]"
                  >
                    Artikel
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[#1f1b13]/80 line-clamp-1 max-w-[14rem] sm:max-w-none">
                  {article.title}
                </li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-[#c49a4a] text-[10px] tracking-[0.18em] uppercase font-medium">
                {article.category}
              </span>
              <span className="text-[#1f1b13]/30 text-[10px]">·</span>
              <time
                className="text-[#1f1b13]/55 text-xs"
                dateTime={String(article.year)}
              >
                {article.year}
              </time>
            </div>

            <h1
              className="pf font-medium tracking-tight leading-[1.15] mb-5"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)" }}
            >
              {article.title}
            </h1>
            <p className="text-[#1f1b13]/70 text-base md:text-lg font-light leading-relaxed mb-8">
              {article.excerpt}
            </p>
          </div>

          <div className="mx-auto mb-10 md:mb-14" style={{ maxWidth: 948 }}>
            <figure
              className="relative overflow-hidden rounded-[10px] border border-[#e7ded0] bg-[#f6f1e7]"
              style={{ aspectRatio: "4/3" }}
              dangerouslySetInnerHTML={{ __html: heroPic }}
            />
          </div>
        </header>

        <div
          className="artikel-body mx-auto"
          style={{
            maxWidth: 720,
            padding: "0 clamp(20px,5vw,84px) clamp(48px,8vw,80px)",
            fontSize: "clamp(16px,1.05vw,18px)",
            lineHeight: 1.75,
          }}
          dangerouslySetInnerHTML={{ __html: article.html }}
        />

        <div
          className="mx-auto border-t border-[#e7ded0]"
          style={{
            maxWidth: 720,
            padding: "clamp(32px,5vw,48px) clamp(20px,5vw,84px)",
          }}
        >
          <p className="text-[#1f1b13]/70 text-sm font-light mb-6">
            Ingin mengenal portfolio hunian Meka Asia atau mendiskusikan
            kebutuhan Anda?
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#projects"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#204130] text-[#fcf9f3] text-xs font-semibold tracking-wide uppercase hover:bg-[#173426] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c49a4a]"
            >
              Lihat Portfolio
            </Link>
            <a
              href="https://wa.me/6281931151888"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#c49a4a] text-[#204130] text-xs font-semibold tracking-wide uppercase hover:bg-[#c49a4a]/10 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#204130]"
            >
              Konsultasi
            </a>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section
          className="bg-[#f6f1e7] border-t border-[#e7ded0]"
          style={{
            padding: "clamp(48px,8vw,80px) clamp(20px,5vw,84px)",
          }}
        >
          <div className="mx-auto" style={{ maxWidth: 1180 }}>
            <h2 className="pf text-xl md:text-2xl font-medium tracking-tight mb-8">
              Artikel Terkait
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {related.map((item) => (
                <RelatedCard key={item.slug} article={item} />
              ))}
            </div>
            <div className="mt-10">
              <Link
                href="/artikel"
                className="text-sm font-medium text-[#204130] underline underline-offset-4 decoration-[#c49a4a]/60 hover:decoration-[#c49a4a]"
              >
                ← Kembali ke daftar artikel
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <footer className="border-t border-[#e7ded0] bg-[#173426] text-[#e0c783]">
        <div
          className="mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm"
          style={{
            maxWidth: 1180,
            padding: "1.5rem clamp(20px,5vw,84px)",
          }}
        >
          <Link href="/" className="hover:text-[#fcf9f3] transition">
            ← Kembali ke Beranda
          </Link>
          <p className="text-[#e0c783]/60">Copyright 2026 Meka Asia Property</p>
        </div>
      </footer>
    </main>
  );
}

// Ensure static generation can resolve all articles at build
export const dynamicParams = false;
