import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "artikel");

const REQUIRED_FIELDS = [
  "title",
  "slug",
  "year",
  "category",
  "excerpt",
  "image",
  "imageAlt",
];

/**
 * Parse simple YAML-like frontmatter from Markdown.
 * Supports: key: value and key: "quoted value"
 */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Missing frontmatter");
  }

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;
    const key = trimmed.slice(0, colon).trim();
    let value = trimmed.slice(colon + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value === "true") data[key] = true;
    else if (value === "false") data[key] = false;
    else if (/^\d+$/.test(value)) data[key] = Number(value);
    else data[key] = value;
  }

  return { data, body: match[2].trim() };
}

function validateArticle(data, fileName) {
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === "") {
      throw new Error(`Article ${fileName}: missing required field "${field}"`);
    }
  }
  if (typeof data.featured !== "boolean") {
    data.featured = false;
  }
  return data;
}

/**
 * Minimal Markdown → safe HTML for article bodies.
 * Supports: paragraphs, ## headings, **bold**. No raw HTML passthrough.
 */
export function markdownToHtml(md) {
  const escaped = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const blocks = escaped.split(/\n{2,}/);
  const html = blocks
    .map((block) => {
      const lines = block.trim();
      if (!lines) return "";

      if (lines.startsWith("## ")) {
        const text = inlineFormat(lines.slice(3).trim());
        return `<h2>${text}</h2>`;
      }

      const withBreaks = lines
        .split(/\n/)
        .map((line) => inlineFormat(line.trim()))
        .join("<br>");
      return `<p>${withBreaks}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return html;
}

function inlineFormat(text) {
  return text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function readArticleFile(fileName) {
  const filePath = path.join(CONTENT_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const meta = validateArticle(data, fileName);
  return {
    ...meta,
    body,
    html: markdownToHtml(body),
    mediaKey: meta.slug,
  };
}

function listMarkdownFiles() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

/**
 * Editorial order: featured first, then year desc, then title.
 */
export function getAllArticles() {
  const articles = listMarkdownFiles().map(readArticleFile);
  return articles.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (b.year !== a.year) return b.year - a.year;
    return a.title.localeCompare(b.title, "id");
  });
}

export function getArticleBySlug(slug) {
  const articles = getAllArticles();
  return articles.find((a) => a.slug === slug) || null;
}

export function getArticleSlugs() {
  return getAllArticles().map((a) => a.slug);
}

/**
 * Related articles: exclude current, prefer same year then newest, max 3.
 */
export function getRelatedArticles(slug, limit = 3) {
  const all = getAllArticles();
  const current = all.find((a) => a.slug === slug);
  if (!current) return all.slice(0, limit);

  const others = all.filter((a) => a.slug !== slug);
  const sameYear = others.filter((a) => a.year === current.year);
  const rest = others.filter((a) => a.year !== current.year);
  return [...sameYear, ...rest].slice(0, limit);
}

/**
 * Card-safe fields only (no body/html) for homepage / index listings.
 */
export function getArticleCards() {
  return getAllArticles().map(
    ({ title, slug, year, category, excerpt, image, imageAlt, featured, mediaKey }) => ({
      title,
      slug,
      year,
      category,
      excerpt,
      image,
      imageAlt,
      featured,
      mediaKey,
    })
  );
}

/** Responsive picture for artikel media variants under /media/artikel/ */
export function artikelPicture({
  mediaKey,
  alt,
  className = "",
  imgClass = "w-full h-full object-cover",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  loading = "lazy",
  fetchpriority,
  widths = [480, 768, 948],
  fallbackImage,
  width = 948,
  height = 721,
}) {
  const base = `/media/artikel/${mediaKey}`;
  const avif = widths.map((w) => `${base}-${w}.avif ${w}w`).join(", ");
  const webp = widths.map((w) => `${base}-${w}.webp ${w}w`).join(", ");
  const fallback =
    fallbackImage || `${base}-${widths.includes(768) ? 768 : widths[0]}.webp`;
  const fp = fetchpriority ? ` fetchpriority="${fetchpriority}"` : "";
  return `<picture class="${className}">
    <source type="image/avif" srcset="${avif}" sizes="${sizes}">
    <source type="image/webp" srcset="${webp}" sizes="${sizes}">
    <img src="${fallback}" class="${imgClass}" alt="${escapeAttr(alt)}" width="${width}" height="${height}" loading="${loading}" decoding="async"${fp}>
  </picture>`;
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildNewsSectionHtml(articles) {
  const featured = articles.find((a) => a.featured) || articles[0];
  const others = articles.filter((a) => a.slug !== featured.slug);

  const featuredPic = artikelPicture({
    mediaKey: featured.mediaKey,
    alt: featured.imageAlt,
    className: "absolute inset-0 block w-full h-full",
    imgClass: "artikel-card-img w-full h-full object-cover",
    sizes: "(min-width: 1024px) 55vw, 100vw",
    loading: "lazy",
    fallbackImage: featured.image,
  });

  const otherCards = others
    .map((article) => {
      const pic = artikelPicture({
        mediaKey: article.mediaKey,
        alt: article.imageAlt,
        className: "absolute inset-0 block w-full h-full",
        imgClass: "artikel-card-img w-full h-full object-cover",
        sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 28vw",
        loading: "lazy",
        fallbackImage: article.image,
      });
      return `
      <a href="/artikel/${article.slug}" class="rv artikel-card group block bg-[#fcf9f3] border border-[#e7ded0] rounded-[10px] overflow-hidden transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#204130]">
        <div class="artikel-card-media relative overflow-hidden bg-[#f6f1e7]" style="aspect-ratio:4/3">
          ${pic}
        </div>
        <div class="p-5 md:p-6 flex flex-col gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[#c49a4a] text-[10px] tracking-[0.18em] uppercase font-medium">${article.category}</span>
            <span class="text-[#1f1b13]/30 text-[10px]">·</span>
            <time class="text-[#1f1b13]/50 text-xs" datetime="${article.year}">${article.year}</time>
          </div>
          <h3 class="pf text-[#1f1b13] text-base md:text-lg font-medium leading-snug tracking-tight line-clamp-3 group-hover:text-[#204130] transition-colors">${escapeHtml(article.title)}</h3>
          <p class="text-[#1f1b13]/60 text-xs md:text-sm font-light leading-relaxed line-clamp-3">${escapeHtml(article.excerpt)}</p>
          <span class="artikel-card-link text-[#c49a4a] text-xs font-medium tracking-wide inline-flex items-center gap-1.5 mt-1">Baca Selengkapnya <span aria-hidden="true">→</span></span>
        </div>
      </a>`;
    })
    .join("");

  return `
<!-- NEWS & RECOGNITION -->
<section id="news" class="on-light bg-[#f6f1e7]" style="padding:clamp(70px,10vw,140px) clamp(20px,5vw,84px)">
  <div class="mx-auto" style="max-width:1180px">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
      <div class="max-w-2xl">
        <span class="rv text-[#c49a4a] text-xs tracking-[0.3em] uppercase font-medium mb-5 block">News &amp; Recognition</span>
        <h2 class="wipe pf text-[#1f1b13] font-medium tracking-tight leading-[1.1] mb-5" style="font-size:clamp(1.7rem,3.5vw,2.8rem)">Prestasi yang Dibangun dari Kepercayaan</h2>
        <p class="rv text-[#1f1b13]/70 text-sm md:text-base font-light">Pencapaian PT. Meka Asia Properti dalam pengembangan hunian berkualitas di Lombok, melalui pengakuan dari mitra perbankan dan ajang industri properti nasional.</p>
      </div>
      <a href="/artikel" class="rv shrink-0 text-[#204130] text-xs font-semibold tracking-wide uppercase underline underline-offset-4 decoration-[#c49a4a]/60 hover:decoration-[#c49a4a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#204130]">Lihat Semua Artikel</a>
    </div>

    <a href="/artikel/${featured.slug}" class="rv artikel-card artikel-featured group grid lg:grid-cols-[1.15fr_0.85fr] bg-[#fcf9f3] border border-[#e7ded0] rounded-[10px] overflow-hidden mb-5 md:mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#204130]">
      <div class="artikel-card-media relative overflow-hidden bg-[#f6f1e7] min-h-[220px]" style="aspect-ratio:4/3">
        ${featuredPic}
      </div>
      <div class="flex flex-col justify-center p-6 md:p-8 lg:p-10 gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full bg-[#204130]/08 text-[#204130] text-[10px] tracking-[0.16em] uppercase font-semibold">Featured</span>
          <span class="text-[#c49a4a] text-[10px] tracking-[0.18em] uppercase font-medium">${featured.category}</span>
          <span class="text-[#1f1b13]/30 text-[10px]">·</span>
          <time class="text-[#1f1b13]/50 text-xs" datetime="${featured.year}">${featured.year}</time>
        </div>
        <h3 class="pf text-[#1f1b13] font-medium tracking-tight leading-snug group-hover:text-[#204130] transition-colors" style="font-size:clamp(1.25rem,2.4vw,1.75rem)">${escapeHtml(featured.title)}</h3>
        <p class="text-[#1f1b13]/65 text-sm font-light leading-relaxed line-clamp-3">${escapeHtml(featured.excerpt)}</p>
        <span class="artikel-card-link text-[#c49a4a] text-xs font-medium tracking-wide inline-flex items-center gap-1.5">Baca Selengkapnya <span aria-hidden="true">→</span></span>
      </div>
    </a>

    <div class="grid sm:grid-cols-2 gap-5 md:gap-6">
      ${otherCards}
    </div>
  </div>
</section>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
