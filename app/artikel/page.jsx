import Link from "next/link";
import {
  artikelPicture,
  getArticleCards,
} from "../../lib/artikel";

export const metadata = {
  title: "News & Recognition | Meka Asia Property",
  description:
    "Prestasi dan pengakuan PT. Meka Asia Properti dalam pengembangan hunian berkualitas di Lombok.",
};

function ArticleCard({ article, featured = false }) {
  const picHtml = artikelPicture({
    mediaKey: article.mediaKey,
    alt: article.imageAlt,
    className: "absolute inset-0 block w-full h-full",
    imgClass: "artikel-card-img w-full h-full object-cover",
    sizes: featured
      ? "(min-width: 1024px) 55vw, 100vw"
      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    loading: featured ? "eager" : "lazy",
    fetchpriority: featured ? "high" : undefined,
    fallbackImage: article.image,
  });

  return (
    <Link
      href={`/artikel/${article.slug}`}
      className={`artikel-card group block bg-[#fcf9f3] border border-[#e7ded0] rounded-[10px] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#204130] ${
        featured ? "artikel-featured lg:grid lg:grid-cols-[1.15fr_0.85fr]" : ""
      }`}
    >
      <div
        className="artikel-card-media relative overflow-hidden bg-[#f6f1e7] min-h-[200px]"
        style={{ aspectRatio: "4/3" }}
        dangerouslySetInnerHTML={{ __html: picHtml }}
      />
      <div
        className={`flex flex-col gap-3 ${
          featured
            ? "justify-center p-6 md:p-8 lg:p-10"
            : "p-5 md:p-6"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {featured ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#204130]/08 text-[#204130] text-[10px] tracking-[0.16em] uppercase font-semibold">
              Featured
            </span>
          ) : null}
          <span className="text-[#c49a4a] text-[10px] tracking-[0.18em] uppercase font-medium">
            {article.category}
          </span>
          <span className="text-[#1f1b13]/30 text-[10px]">·</span>
          <time className="text-[#1f1b13]/50 text-xs" dateTime={String(article.year)}>
            {article.year}
          </time>
        </div>
        <h2
          className={`pf text-[#1f1b13] font-medium tracking-tight leading-snug group-hover:text-[#204130] transition-colors ${
            featured
              ? "text-xl md:text-2xl"
              : "text-base md:text-lg line-clamp-3"
          }`}
        >
          {article.title}
        </h2>
        <p className="text-[#1f1b13]/60 text-sm font-light leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
        <span className="artikel-card-link text-[#c49a4a] text-xs font-medium tracking-wide inline-flex items-center gap-1.5 mt-1">
          Baca Selengkapnya <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function ArtikelIndexPage() {
  const articles = getArticleCards();
  const featured = articles.find((a) => a.featured) || articles[0];
  const others = articles.filter((a) => a.slug !== featured?.slug);

  return (
    <main className="on-light min-h-screen bg-[#f6f1e7] text-[#1f1b13]">
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
          <a
            href="https://wa.me/6281931151888"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold tracking-wide uppercase text-[#204130] underline underline-offset-4 decoration-[#c49a4a]/50"
          >
            Konsultasi
          </a>
        </div>
      </header>

      <section
        style={{
          padding: "clamp(48px,8vw,96px) clamp(20px,5vw,84px) clamp(70px,10vw,120px)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 1180 }}>
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
              <li className="text-[#1f1b13]/80">Artikel</li>
            </ol>
          </nav>

          <span className="text-[#c49a4a] text-xs tracking-[0.3em] uppercase font-medium mb-5 block">
            News &amp; Recognition
          </span>
          <h1
            className="pf font-medium tracking-tight leading-[1.1] mb-5 max-w-3xl"
            style={{ fontSize: "clamp(1.8rem,4vw,3rem)" }}
          >
            Prestasi yang Dibangun dari Kepercayaan
          </h1>
          <p className="text-[#1f1b13]/70 text-sm md:text-base font-light max-w-2xl mb-12">
            Lima pengakuan bagi PT. Meka Asia Properti atas kualitas hunian,
            perencanaan kawasan, dan komitmen pelayanan di Lombok.
          </p>

          {featured ? (
            <div className="mb-6 md:mb-8">
              <ArticleCard article={featured} featured />
            </div>
          ) : null}

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {others.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

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
