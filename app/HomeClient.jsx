"use client";

import Script from "next/script";
import { useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import PromoPopup from "./components/PromoPopup";

/** Responsive picture from /public/media variants (AVIF + WebP). */
function mediaPicture({
  name,
  alt,
  className = "",
  imgClass = "w-full h-full object-cover",
  sizes = "100vw",
  loading = "lazy",
  fetchpriority,
  widths = [480, 768, 1280, 1920],
  objectPosition,
}) {
  const avif = widths.map((w) => `/media/${name}-${w}.avif ${w}w`).join(", ");
  const webp = widths.map((w) => `/media/${name}-${w}.webp ${w}w`).join(", ");
  const fallback = `/media/${name}-${widths.includes(768) ? 768 : widths[0]}.webp`;
  const style = objectPosition ? ` style="object-position:${objectPosition}"` : "";
  const fp = fetchpriority ? ` fetchpriority="${fetchpriority}"` : "";
  return `<picture class="${className}">
    <source type="image/avif" srcset="${avif}" sizes="${sizes}">
    <source type="image/webp" srcset="${webp}" sizes="${sizes}">
    <img src="${fallback}" class="${imgClass}" alt="${alt}" loading="${loading}" decoding="async"${fp}${style}>
  </picture>`;
}

const cardSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
const filmSizes = "100vw";

function buildPageMarkup(newsSectionHtml) {
  return `
<!-- NAV -->
<nav id="nav" class="nav-shell fixed flex items-center justify-between">
  <a href="#home" class="nav-logo flex items-center" aria-label="Meka Asia home">
    <img src="/brand/meka-asia-logo-new.png" class="nav-logo-img" alt="Meka Asia" width="124" height="32">
  </a>
  <div class="hidden md:flex items-center gap-6 lg:gap-8">
    <a href="#home" class="nav-txt text-xs tracking-wide uppercase font-medium">Home</a>
    <a href="#why-meka" class="nav-txt text-xs tracking-wide uppercase font-medium">About</a>
    <a href="#projects" class="nav-txt text-xs tracking-wide uppercase font-medium">Projects</a>
    <a href="#experience" class="nav-txt text-xs tracking-wide uppercase font-medium">Experience</a>
    <a href="#news" class="nav-txt text-xs tracking-wide uppercase font-medium">News</a>
    <a href="#gallery" class="nav-txt text-xs tracking-wide uppercase font-medium">Gallery</a>
    <a href="/simulasi-kpr" class="nav-txt text-xs tracking-wide uppercase font-medium">Simulasi KPR</a>
  </div>
  <a href="https://wa.me/6281931151888" target="_blank" rel="noopener noreferrer" class="nav-cta text-xs tracking-wide uppercase font-medium px-5 py-2.5 rounded-full hidden md:flex items-center gap-2 transition">
    <iconify-icon icon="solar:chat-round-line-linear" width="16"></iconify-icon> Consult
  </a>
  <button id="mobileMenuToggle" class="mobile-menu-toggle hidden" type="button" aria-label="Buka menu navigasi" aria-controls="mobileNavPanel" aria-expanded="false">
    <iconify-icon id="mobileMenuIcon" icon="solar:hamburger-menu-linear" width="24"></iconify-icon>
  </button>
</nav>
<div id="mobileNavBackdrop" class="mobile-nav-backdrop hidden" aria-hidden="true"></div>
<div id="mobileNavPanel" class="mobile-nav-panel hidden" role="dialog" aria-modal="true" aria-label="Menu navigasi" aria-hidden="true" inert>
  <nav class="mobile-nav-links" aria-label="Navigasi mobile">
    <a href="#home">Home</a>
    <a href="#why-meka">About</a>
    <a href="#projects">Projects</a>
    <a href="#experience">Experience</a>
    <a href="#news">News</a>
    <a href="#gallery">Gallery</a>
    <a href="/simulasi-kpr" class="mobile-nav-feature">Simulasi KPR</a>
  </nav>
  <a href="https://wa.me/6281931151888" target="_blank" rel="noopener noreferrer" class="mobile-nav-consult">
    <iconify-icon icon="solar:chat-round-line-linear" width="18"></iconify-icon>
    Consult via WhatsApp
  </a>
</div>

<!-- HERO -->
<section id="home" class="relative overflow-hidden">
  <div class="absolute inset-0" style="z-index:0">
    <div id="heroMedia" class="absolute inset-0 w-full h-[120%]">
      <div class="hero-slide absolute inset-0 is-active" data-hero="photo" data-hero-index="0">
        <img src="/hero/meka-asia.jpeg" class="hero-meka-asia-img w-full h-full object-cover" alt="Meka Asia residence" decoding="async" fetchpriority="high" width="1600" height="900">
      </div>
      <div class="hero-slide absolute inset-0 is-idle" data-hero="photo" data-hero-index="1">
        <picture>
          <source media="(max-width: 767px)" srcset="/hero/green-asia-mobile.jpeg">
          <img src="/hero/green-asia.jpeg" class="w-full h-full object-cover" alt="Green Asia residence" loading="lazy" decoding="async" width="1600" height="900">
        </picture>
      </div>
      <div class="hero-slide absolute inset-0 is-idle" data-hero="photo" data-hero-index="2">
        <picture>
          <source media="(max-width: 767px)" srcset="/hero/green-thamarin-mobile.jpg">
          <img src="/hero/green-thamarin.jpeg" class="w-full h-full object-cover" alt="Green Tamarin residence" loading="lazy" decoding="async" width="1600" height="900">
        </picture>
      </div>
      <div class="hero-slide absolute inset-0 is-idle" data-hero="photo" data-hero-index="3">
        <picture>
          <source media="(max-width: 767px)" srcset="/hero/lavida-mobile.jpg">
          <img src="/hero/lavida.jpeg" class="w-full h-full object-cover" alt="Lavida residence" loading="lazy" decoding="async" width="1600" height="900">
        </picture>
      </div>
      <div class="hero-slide absolute inset-0 is-idle" data-hero="photo" data-hero-index="4">
        <picture>
          <source media="(max-width: 767px)" srcset="/hero/melanesia-mobile.jpg">
          <img src="/hero/melanesia.jpeg" class="w-full h-full object-cover" alt="Melanesia residence" loading="lazy" decoding="async" width="1600" height="900">
        </picture>
      </div>
      <div class="hero-slide absolute inset-0 is-idle" data-hero="photo" data-hero-index="5">
        <picture>
          <source media="(max-width: 767px)" srcset="/hero/polinesia-mobile.jpg">
          <img src="/hero/polinesia.jpeg" class="w-full h-full object-cover" alt="Polinesia residence" loading="lazy" decoding="async" width="1600" height="900">
        </picture>
      </div>
    </div>
    <div class="absolute inset-0" style="background:radial-gradient(ellipse at center,rgba(23,52,38,.15) 0%,rgba(23,52,38,.55) 70%,rgba(15,30,22,.85) 100%)"></div>
  </div>
  <div class="gl-fallback absolute inset-0" style="z-index:1;background:radial-gradient(ellipse at 30% 20%,rgba(196,154,74,.18),transparent 55%),radial-gradient(ellipse at 70% 80%,rgba(32,65,48,.35),transparent 50%)" aria-hidden="true"></div>
  <canvas id="heroGl" class="gl-canvas absolute inset-0 w-full h-full" style="z-index:1;mix-blend-mode:screen;opacity:.5" aria-hidden="true" data-webgl="hero"></canvas>
  <div class="relative h-full flex flex-col justify-center" style="z-index:3;padding:0 clamp(20px,5vw,84px)">
    <h1 class="text-[#fcf9f3] pf font-semibold tracking-tight leading-[0.95] mb-7" style="font-size:clamp(2.6rem,8vw,6.5rem);text-shadow:0 2px 20px rgba(0,0,0,.5)">
      <span class="ln"><span>Dream Home</span></span>
      <span class="ln"><span class="italic text-[#e8d5a8]">in Lombok</span></span>
    </h1>
    <div class="ln max-w-xl mb-9"><span class="text-white/85 text-sm md:text-base font-light" style="text-shadow:0 1px 10px rgba(0,0,0,.6)">Premium residential developments crafted for comfort, trust, and long-term value.</span></div>
    <div class="flex flex-wrap gap-4">
      <a href="https://wa.me/6281931151888" target="_blank" rel="noopener noreferrer" class="btn bg-[#c49a4a] text-[#173426] text-xs md:text-sm font-semibold tracking-wide px-7 py-4 rounded-full flex items-center gap-2.5 hover:bg-white">
        <iconify-icon icon="solar:chat-round-line-linear" width="18"></iconify-icon> Consult via WhatsApp <span class="arw">&rarr;</span>
      </a>
      <a href="#projects" class="btn border border-white/50 text-white text-xs md:text-sm font-medium tracking-wide px-7 py-4 rounded-full items-center gap-2.5 hover:bg-white/10 hidden md:flex">
        View Projects <span class="arw">&rarr;</span>
      </a>
    </div>
  </div>
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2" style="z-index:3" id="heroDots" aria-label="Hero media slides" role="tablist">
    <button type="button" class="hero-dot is-active" data-hero-index="0" aria-label="Show Meka Asia" role="tab" aria-selected="true"></button>
    <button type="button" class="hero-dot" data-hero-index="1" aria-label="Show Green Asia" role="tab" aria-selected="false"></button>
    <button type="button" class="hero-dot" data-hero-index="2" aria-label="Show Green Tamarin" role="tab" aria-selected="false"></button>
    <button type="button" class="hero-dot" data-hero-index="3" aria-label="Show Lavida" role="tab" aria-selected="false"></button>
    <button type="button" class="hero-dot" data-hero-index="4" aria-label="Show Melanesia" role="tab" aria-selected="false"></button>
    <button type="button" class="hero-dot" data-hero-index="5" aria-label="Show Polinesia" role="tab" aria-selected="false"></button>
  </div>
</section>

<!-- INTRO -->
<section class="on-light bg-[#fcf9f3] text-center" style="padding:clamp(80px,12vw,160px) clamp(20px,5vw,84px)">
  <div class="max-w-3xl mx-auto flex flex-col items-center">
    <div class="rule w-px h-16 bg-[#c49a4a] mb-10"></div>
    <span class="rv text-[#c49a4a] text-xs tracking-[0.3em] uppercase font-medium mb-6">Company Profile</span>
    <h2 class="wipe pf text-[#1f1b13] font-medium tracking-tight leading-[1.15] mb-8" style="font-size:clamp(1.8rem,4.5vw,3.2rem)">Built on Trust, Designed<br>for Lombok Living</h2>
    <p class="rv text-[#1f1b13]/70 text-sm md:text-base font-light max-w-2xl">PT. Meka Asia Property is a real estate and property company established on July 14, 2018, and operates as part of Daya Cipta Group. As one of Lombok's leading property developers, Meka Asia Property develops premium residential communities through strategic locations, reliable planning, legal clarity, and consistent on-site delivery.</p>
    <div class="rv brand-marquee-shell" aria-label="Meka Asia portfolio logos">
      <div class="brand-marquee-track">
        <figure class="brand-marquee-card"><img src="/logos/living-asia-marquee.png" alt="Living Asia" width="154" height="68" loading="lazy" decoding="async"></figure>
        <figure class="brand-marquee-card"><img src="/logos/green-asia-marquee.png" alt="Green Asia" width="154" height="68" loading="lazy" decoding="async"></figure>
        <figure class="brand-marquee-card"><img src="/logos/lavida-marquee.png" alt="Lavida" width="154" height="68" loading="lazy" decoding="async"></figure>
        <figure class="brand-marquee-card"><img src="/logos/melanesia-marquee.png" alt="Melanesia" width="154" height="68" loading="lazy" decoding="async"></figure>
        <figure class="brand-marquee-card"><img src="/logos/polinesia-marquee.png" alt="Polinesia" width="154" height="68" loading="lazy" decoding="async"></figure>
        <figure class="brand-marquee-card" aria-hidden="true"><img src="/logos/living-asia-marquee.png" alt="" width="154" height="68" loading="lazy" decoding="async"></figure>
        <figure class="brand-marquee-card" aria-hidden="true"><img src="/logos/green-asia-marquee.png" alt="" width="154" height="68" loading="lazy" decoding="async"></figure>
        <figure class="brand-marquee-card" aria-hidden="true"><img src="/logos/lavida-marquee.png" alt="" width="154" height="68" loading="lazy" decoding="async"></figure>
        <figure class="brand-marquee-card" aria-hidden="true"><img src="/logos/melanesia-marquee.png" alt="" width="154" height="68" loading="lazy" decoding="async"></figure>
        <figure class="brand-marquee-card" aria-hidden="true"><img src="/logos/polinesia-marquee.png" alt="" width="154" height="68" loading="lazy" decoding="async"></figure>
      </div>
    </div>
  </div>
</section>

<!-- SPLIT FEATURE -->
<section id="why-meka" class="on-light bg-[#fcf9f3] border-y border-[#e7ded0]">
  <div class="grid lg:grid-cols-[0.92fr_1.08fr] min-h-[92vh]">
    <div class="relative min-h-[58vh] lg:min-h-full overflow-hidden bg-[#173426]">
      <div class="parallax-frame absolute inset-0 overflow-hidden">
        <div id="whyMekaImg" class="parallax-media absolute inset-x-0 top-[-8%] h-[116%] w-full">
          ${mediaPicture({
            name: "living-asia-entrance",
            alt: "Living Asia entrance",
            imgClass: "w-full h-full object-cover object-center",
            sizes: "(min-width: 1024px) 46vw, 100vw",
            loading: "lazy",
            widths: [480],
          })}
        </div>
      </div>
      <div class="absolute inset-0" style="z-index:1;background:linear-gradient(180deg,rgba(23,52,38,.04),rgba(23,52,38,.42))"></div>
      <div class="rv absolute left-6 right-6 bottom-6 md:left-10 md:right-10 md:bottom-10 text-white" style="z-index:2">
        <p class="pf max-w-md text-2xl md:text-4xl font-medium leading-tight tracking-tight" style="text-shadow:0 2px 18px rgba(0,0,0,.45)">Arrive where comfort, design, and investment value meet.</p>
      </div>
    </div>
    <div class="flex flex-col justify-center" style="padding:clamp(48px,7vw,104px) clamp(24px,6vw,88px)">
      <span class="rv text-[#c49a4a] text-xs tracking-[0.3em] uppercase font-medium mb-6">Why Meka Asia</span>
      <h2 class="wipe pf text-[#1f1b13] font-medium tracking-tight leading-[1.05] mb-7" style="font-size:clamp(2rem,4.8vw,4.35rem)">Built for Living.<br>Planned for Long-Term Value.</h2>
      <p class="rv max-w-2xl text-[#1f1b13]/70 text-sm md:text-base font-light mb-9">Meka Asia Property develops residential communities in Lombok with a focus on strategic locations, legal clarity, practical planning, and consistent on-site delivery. Every project is designed not only as a place to live, but as an asset with lasting value.</p>

      <div class="rv grid sm:grid-cols-2 border-y border-[#e7ded0] divide-y sm:divide-y-0 sm:divide-x divide-[#e7ded0] mb-9">
        <div class="py-5 pr-5">
          <span class="block h-px w-9 bg-[#c49a4a] mb-4"></span>
          <h3 class="text-[#1f1b13] text-sm font-semibold mb-1">Strategic Lombok Locations</h3>
          <p class="text-[#1f1b13]/55 text-xs font-light leading-relaxed">Selected areas with residential growth potential and everyday access.</p>
        </div>
        <div class="py-5 sm:pl-5">
          <span class="block h-px w-9 bg-[#c49a4a] mb-4"></span>
          <h3 class="text-[#1f1b13] text-sm font-semibold mb-1">Clear Legal Process</h3>
          <p class="text-[#1f1b13]/55 text-xs font-light leading-relaxed">Projects are planned with documentation clarity before delivery.</p>
        </div>
        <div class="py-5 pr-5 sm:border-t sm:border-[#e7ded0]">
          <span class="block h-px w-9 bg-[#c49a4a] mb-4"></span>
          <h3 class="text-[#1f1b13] text-sm font-semibold mb-1">Practical Residential Planning</h3>
          <p class="text-[#1f1b13]/55 text-xs font-light leading-relaxed">Layouts, access, and area planning shaped for real daily living.</p>
        </div>
        <div class="py-5 sm:pl-5 sm:border-t sm:border-[#e7ded0]">
          <span class="block h-px w-9 bg-[#c49a4a] mb-4"></span>
          <h3 class="text-[#1f1b13] text-sm font-semibold mb-1">On-Site Delivery Standard</h3>
          <p class="text-[#1f1b13]/55 text-xs font-light leading-relaxed">A hands-on development approach from planning to field execution.</p>
        </div>
      </div>

      <div class="rv grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#e7ded0] mb-9">
        <div class="bg-[#fcf9f3] py-5 px-4"><span class="pf text-[#1f1b13] text-3xl leading-none">2018</span><span class="block text-[#1f1b13]/45 text-[0.62rem] tracking-widest uppercase mt-2">Established</span></div>
        <div class="bg-[#fcf9f3] py-5 px-4"><span class="pf text-[#1f1b13] text-3xl leading-none">6+</span><span class="block text-[#1f1b13]/45 text-[0.62rem] tracking-widest uppercase mt-2">Portfolios</span></div>
        <div class="bg-[#fcf9f3] py-5 px-4"><span class="pf text-[#1f1b13] text-3xl leading-none">Lombok</span><span class="block text-[#1f1b13]/45 text-[0.62rem] tracking-widest uppercase mt-2">Development Focus</span></div>
      </div>

      <a href="https://wa.me/6281931151888" target="_blank" rel="noopener noreferrer" class="btn rv inline-flex w-fit items-center gap-3 rounded-full bg-[#204130] px-6 py-3 text-sm font-semibold text-[#fcf9f3] shadow-[0_18px_40px_rgba(23,52,38,.16)] hover:bg-[#c49a4a] hover:text-[#173426]">
        Schedule a Private Consultation
        <span class="arw inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/12"><iconify-icon icon="solar:arrow-right-linear" width="15"></iconify-icon></span>
      </a>
    </div>
  </div>
</section>

<!-- PROJECTS -->
<section id="projects" class="bg-[#173426]" style="padding:clamp(70px,10vw,140px) clamp(20px,5vw,84px)">
  <div class="max-w-2xl mb-14">
    <span class="rv text-[#c49a4a] text-xs tracking-[0.3em] uppercase font-medium mb-5 block">Portfolio</span>
    <h2 class="wipe pf text-[#fcf9f3] font-medium tracking-tight leading-[1.1]" style="font-size:clamp(1.9rem,4vw,3rem)">Signature Developments</h2>
  </div>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <a href="#reserve" class="pcard rv group relative overflow-hidden rounded-lg h-[380px] block">
      ${mediaPicture({ name: "jaipur", alt: "Living Asia residential project", imgClass: "w-full h-full object-cover object-right", sizes: cardSizes, widths: [480, 768, 1280] })}
      <div class="absolute inset-0" style="background:linear-gradient(transparent,rgba(8,28,26,.66))"></div>
      <div class="absolute bottom-0 left-0 p-6"><h3 class="pf text-white text-2xl font-medium tracking-tight mb-1">Living Asia</h3><p class="text-white/70 text-xs font-light mb-3">A modern residential neighborhood with tropical streetscapes and everyday family comfort.</p><span class="text-[#c49a4a] text-xs font-semibold flex items-center gap-1.5">View Project <iconify-icon icon="solar:arrow-right-up-linear" width="14"></iconify-icon></span></div>
    </a>
    <a href="#reserve" class="pcard rv group relative overflow-hidden rounded-lg h-[380px] block">
      ${mediaPicture({ name: "green-thamarin", alt: "Green Tamarin residential development", imgClass: "w-full h-full object-cover object-center", sizes: cardSizes, widths: [480, 768, 1280] })}
      <div class="absolute inset-0" style="background:linear-gradient(transparent,rgba(8,28,26,.66))"></div>
      <div class="absolute bottom-0 left-0 p-6"><h3 class="pf text-white text-2xl font-medium tracking-tight mb-1">Green Tamarin</h3><p class="text-white/70 text-xs font-light mb-3">Lush tropical living with open green corridors, breezy streetscapes, and nature-first family homes.</p><span class="text-[#c49a4a] text-xs font-semibold flex items-center gap-1.5">View Project <iconify-icon icon="solar:arrow-right-up-linear" width="14"></iconify-icon></span></div>
    </a>
    <a href="#reserve" class="pcard rv group relative overflow-hidden rounded-lg h-[380px] block">
      ${mediaPicture({ name: "melanesia-private-facade", alt: "Melanesia private residence facade", imgClass: "w-full h-full object-cover object-center", sizes: cardSizes })}
      <div class="absolute inset-0" style="background:linear-gradient(transparent,rgba(8,28,26,.66))"></div>
      <div class="absolute bottom-0 left-0 p-6"><h3 class="pf text-white text-2xl font-medium tracking-tight mb-1">Melanesia</h3><p class="text-white/70 text-xs font-light mb-3">Private tropical homes with warm timber accents, clean lines, and calm residential streets.</p><span class="text-[#c49a4a] text-xs font-semibold flex items-center gap-1.5">View Project <iconify-icon icon="solar:arrow-right-up-linear" width="14"></iconify-icon></span></div>
    </a>
    <a href="#reserve" class="pcard rv group relative overflow-hidden rounded-lg h-[380px] block">
      ${mediaPicture({ name: "polinesia-gable-home", alt: "Polinesia modern gable home", imgClass: "w-full h-full object-cover object-center", sizes: cardSizes })}
      <div class="absolute inset-0" style="background:linear-gradient(transparent,rgba(8,28,26,.66))"></div>
      <div class="absolute bottom-0 left-0 p-6"><h3 class="pf text-white text-2xl font-medium tracking-tight mb-1">Polinesia</h3><p class="text-white/70 text-xs font-light mb-3">Modern gable homes with efficient layouts, warm facade details, and simple everyday access.</p><span class="text-[#c49a4a] text-xs font-semibold flex items-center gap-1.5">View Project <iconify-icon icon="solar:arrow-right-up-linear" width="14"></iconify-icon></span></div>
    </a>
    <a href="#reserve" class="pcard rv group relative overflow-hidden rounded-lg h-[380px] block">
      ${mediaPicture({ name: "green-asia-garden-home", alt: "Green Asia garden residence", imgClass: "w-full h-full object-cover object-center", sizes: cardSizes })}
      <div class="absolute inset-0" style="background:linear-gradient(transparent,rgba(8,28,26,.66))"></div>
      <div class="absolute bottom-0 left-0 p-6"><h3 class="pf text-white text-2xl font-medium tracking-tight mb-1">Green Asia</h3><p class="text-white/70 text-xs font-light mb-3">Garden-forward residences with soft green facades, natural shade, and relaxed daily living.</p><span class="text-[#c49a4a] text-xs font-semibold flex items-center gap-1.5">View Project <iconify-icon icon="solar:arrow-right-up-linear" width="14"></iconify-icon></span></div>
    </a>
    <a href="#reserve" class="pcard rv group relative overflow-hidden rounded-lg h-[380px] block">
      ${mediaPicture({ name: "lavida-show-unit", alt: "Lavida show unit exterior", imgClass: "w-full h-full object-cover object-center", sizes: cardSizes })}
      <div class="absolute inset-0" style="background:linear-gradient(transparent,rgba(8,28,26,.66))"></div>
      <div class="absolute bottom-0 left-0 p-6"><h3 class="pf text-white text-2xl font-medium tracking-tight mb-1">Lavida</h3><p class="text-white/70 text-xs font-light mb-3">Compact modern homes with clean gable forms, green frontage, and practical daily comfort.</p><span class="text-[#c49a4a] text-xs font-semibold flex items-center gap-1.5">View Project <iconify-icon icon="solar:arrow-right-up-linear" width="14"></iconify-icon></span></div>
    </a>
  </div>
  <div class="rv mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/10 pt-10">
    <div>
      <h3 class="pf text-white text-xl md:text-2xl font-medium tracking-tight mb-2">Not sure which project fits?</h3>
      <p class="text-white/55 text-sm font-light max-w-md">Our team maps your goals to the right development — free consultation, no pressure.</p>
    </div>
    <div class="flex flex-wrap items-center gap-3 shrink-0">
      <a href="/simulasi-kpr" class="btn border border-white/30 text-white text-xs font-semibold px-7 py-3.5 rounded-full flex items-center gap-2 hover:border-[#c49a4a] hover:text-[#c49a4a]">Simulasi KPR</a>
      <a href="https://wa.me/6281931151888" target="_blank" rel="noopener noreferrer" class="btn bg-[#c49a4a] text-[#173426] text-xs font-semibold px-7 py-3.5 rounded-full flex items-center gap-2">Consult Now <span class="arw">&rarr;</span></a>
    </div>
  </div>
</section>

<!-- EXPERIENCE / CINEMATIC: CSS sticky + ScrollTrigger progress (no pin) -->
<section id="experience" class="relative">
  <div id="filmWrapper" class="film-desktop cinematic-wrapper">
    <div id="filmStage" class="cinematic-stage relative overflow-hidden bg-black">
      <div class="film-slide absolute inset-0 is-active" data-film-index="0">
        ${mediaPicture({ name: "morning-at-home-living-maldives", alt: "Morning at home balcony view", imgClass: "w-full h-full object-cover object-center", sizes: filmSizes, loading: "eager", fetchpriority: "high" })}
      </div>
      <div class="film-slide absolute inset-0 is-idle" data-film-index="1">
        ${mediaPicture({ name: "living-asia-entrance-visit", alt: "Living Asia entrance walkthrough", imgClass: "w-full h-full object-cover object-left md:object-center", sizes: filmSizes, loading: "lazy" })}
      </div>
      <div class="film-slide absolute inset-0 is-idle" data-film-index="2">
        ${mediaPicture({ name: "living-room-maldives", alt: "Living room lounge at midday", imgClass: "w-full h-full object-cover object-center", sizes: filmSizes, loading: "lazy" })}
      </div>
      <div class="film-slide absolute inset-0 is-idle" data-film-index="3">
        ${mediaPicture({ name: "poolside-afternoon", alt: "Poolside afternoon at home", imgClass: "w-full h-full object-cover object-[68%_center] md:object-center", sizes: filmSizes, loading: "lazy" })}
      </div>
      <div class="film-slide absolute inset-0 is-idle" data-film-index="4">
        ${mediaPicture({ name: "future-secured", alt: "Warm modern interior staircase representing a secure future", imgClass: "w-full h-full object-cover object-center", sizes: filmSizes, loading: "lazy", widths: [480, 768, 1280] })}
      </div>
      <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(15,30,22,.75),rgba(0,0,0,.2) 50%,rgba(0,0,0,.35));pointer-events:none"></div>
      <div class="absolute inset-0 flex flex-col justify-center" style="padding:0 clamp(20px,5vw,84px);pointer-events:none">
        <span class="text-[#c49a4a] text-xs tracking-[0.3em] uppercase font-medium mb-4">One Day With Meka Asia</span>
        <div id="filmClock" class="pf text-white font-medium tracking-tight leading-none mb-3" style="font-size:clamp(3rem,10vw,8rem);text-shadow:0 2px 20px rgba(0,0,0,.5)">07:00</div>
        <div id="filmLabel" class="pf text-white/80 text-2xl italic">Morning at Home</div>
      </div>
      <div class="absolute bottom-10 left-0 w-full" style="padding:0 clamp(20px,5vw,84px);pointer-events:none">
        <div class="h-px bg-white/20 overflow-hidden">
          <div id="filmProg" class="h-full bg-[#c49a4a] origin-left" style="transform:scaleX(0)"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- NUMBERS -->
<section class="on-light bg-[#f6f1e7]" style="padding:clamp(60px,9vw,120px) clamp(20px,5vw,84px)">
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
    <div class="rv text-center md:text-left"><div class="pf text-[#204130] font-medium tracking-tight" style="font-size:clamp(2.5rem,5vw,4rem)"><span class="count" data-count="6">0</span></div><span class="text-[#1f1b13]/60 text-xs md:text-sm tracking-wide uppercase">Signature Projects</span></div>
    <div class="rv text-center md:text-left"><div class="pf text-[#204130] font-medium tracking-tight" style="font-size:clamp(2.5rem,5vw,4rem)"><span class="count" data-count="100">0</span>+</div><span class="text-[#1f1b13]/60 text-xs md:text-sm tracking-wide uppercase">Homes Planned</span></div>
    <div class="rv text-center md:text-left"><div class="pf text-[#204130] font-medium tracking-tight" style="font-size:clamp(2.5rem,5vw,4rem)"><span class="count" data-count="1">0</span></div><span class="text-[#1f1b13]/60 text-xs md:text-sm tracking-wide uppercase">Trusted Developer</span></div>
    <div class="rv text-center md:text-left"><div class="pf text-[#204130] font-medium tracking-tight" style="font-size:clamp(2.5rem,5vw,4rem)">24/7</div><span class="text-[#1f1b13]/60 text-xs md:text-sm tracking-wide uppercase">WhatsApp Consultation</span></div>
  </div>
</section>

${newsSectionHtml}

<!-- TESTIMONIALS -->
<section id="gallery" class="bg-[#204130]" style="padding:clamp(70px,10vw,140px) clamp(20px,5vw,84px)">
  <span class="rv text-[#c49a4a] text-xs tracking-[0.3em] uppercase font-medium mb-5 block">Client Voices</span>
  <h2 class="wipe pf text-[#fcf9f3] font-medium tracking-tight leading-[1.1] mb-12 max-w-2xl" style="font-size:clamp(1.8rem,4vw,3rem)">Trusted by Families & Investors</h2>
  <div class="grid md:grid-cols-3 gap-6">
    <div class="rv bg-[#173426] border border-white/10 rounded-lg p-8"><div class="flex gap-1 mb-5 text-[#c49a4a]"><iconify-icon icon="solar:star-bold" width="15"></iconify-icon><iconify-icon icon="solar:star-bold" width="15"></iconify-icon><iconify-icon icon="solar:star-bold" width="15"></iconify-icon><iconify-icon icon="solar:star-bold" width="15"></iconify-icon><iconify-icon icon="solar:star-bold" width="15"></iconify-icon></div><p class="pf text-white/90 text-lg font-light italic leading-relaxed mb-6">"The process was clear, professional, and reassuring from the first consultation."</p><span class="text-white/50 text-xs tracking-wide uppercase">Homeowner &middot; Living Asia</span></div>
    <div class="rv bg-[#173426] border border-white/10 rounded-lg p-8"><div class="flex gap-1 mb-5 text-[#c49a4a]"><iconify-icon icon="solar:star-bold" width="15"></iconify-icon><iconify-icon icon="solar:star-bold" width="15"></iconify-icon><iconify-icon icon="solar:star-bold" width="15"></iconify-icon><iconify-icon icon="solar:star-bold" width="15"></iconify-icon><iconify-icon icon="solar:star-bold" width="15"></iconify-icon></div><p class="pf text-white/90 text-lg font-light italic leading-relaxed mb-6">"Meka Asia helped us understand the project, payment flow, and next steps with confidence."</p><span class="text-white/50 text-xs tracking-wide uppercase">Investor &middot; Lavida</span></div>
    <div class="rv bg-[#173426] border border-white/10 rounded-lg p-8"><div class="flex gap-1 mb-5 text-[#c49a4a]"><iconify-icon icon="solar:star-bold" width="15"></iconify-icon><iconify-icon icon="solar:star-bold" width="15"></iconify-icon><iconify-icon icon="solar:star-bold" width="15"></iconify-icon><iconify-icon icon="solar:star-bold" width="15"></iconify-icon><iconify-icon icon="solar:star-bold" width="15"></iconify-icon></div><p class="pf text-white/90 text-lg font-light italic leading-relaxed mb-6">"A premium property experience with a team that feels reliable and responsive."</p><span class="text-white/50 text-xs tracking-wide uppercase">Buyer &middot; Green Asia</span></div>
  </div>
</section>

<!-- FAQ -->
<section class="on-light bg-[#fcf9f3]" style="padding:clamp(70px,10vw,140px) clamp(20px,5vw,84px)">
  <div class="max-w-3xl mx-auto">
    <span class="rv text-[#c49a4a] text-xs tracking-[0.3em] uppercase font-medium mb-5 block text-center">FAQ</span>
    <h2 class="wipe pf text-[#1f1b13] font-medium tracking-tight leading-[1.1] mb-12 text-center" style="font-size:clamp(1.8rem,4vw,3rem)">Clear answers before you visit.</h2>
    <div class="space-y-3" id="faq">
      <div class="faq-item border border-[#e7ded0] rounded-lg overflow-hidden bg-[#f6f1e7]/40"><button class="faq-head w-full flex items-center justify-between p-6 text-left"><span class="text-[#1f1b13] text-sm md:text-base font-medium">Apakah Meka Asia menyediakan opsi KPR?</span><iconify-icon icon="solar:add-circle-linear" width="22" class="faq-ic text-[#c49a4a] transition-transform"></iconify-icon></button><div class="faq-body px-6"><p class="text-[#1f1b13]/65 text-sm font-light pb-6">Tim Meka Asia dapat membantu konsultasi awal, simulasi kebutuhan dokumen, dan koordinasi informasi dengan mitra pembiayaan yang relevan.</p></div></div>
      <div class="faq-item border border-[#e7ded0] rounded-lg overflow-hidden bg-[#f6f1e7]/40"><button class="faq-head w-full flex items-center justify-between p-6 text-left"><span class="text-[#1f1b13] text-sm md:text-base font-medium">Apa saja portfolio properti Meka Asia?</span><iconify-icon icon="solar:add-circle-linear" width="22" class="faq-ic text-[#c49a4a] transition-transform"></iconify-icon></button><div class="faq-body px-6"><p class="text-[#1f1b13]/65 text-sm font-light pb-6">Portfolio mencakup Perumahan Meka Asia, Living Asia, Green Asia, Green Tamarin, Polinesia, Lavida, dan Melanesia.</p></div></div>
      <div class="faq-item border border-[#e7ded0] rounded-lg overflow-hidden bg-[#f6f1e7]/40"><button class="faq-head w-full flex items-center justify-between p-6 text-left"><span class="text-[#1f1b13] text-sm md:text-base font-medium">Bagaimana status legalitas proyek?</span><iconify-icon icon="solar:add-circle-linear" width="22" class="faq-ic text-[#c49a4a] transition-transform"></iconify-icon></button><div class="faq-body px-6"><p class="text-[#1f1b13]/65 text-sm font-light pb-6">Setiap proyek perlu dikonfirmasi langsung dengan tim sales agar calon pembeli menerima informasi legalitas dan ketersediaan terbaru.</p></div></div>
      <div class="faq-item border border-[#e7ded0] rounded-lg overflow-hidden bg-[#f6f1e7]/40"><button class="faq-head w-full flex items-center justify-between p-6 text-left"><span class="text-[#1f1b13] text-sm md:text-base font-medium">Bagaimana cara survei lokasi?</span><iconify-icon icon="solar:add-circle-linear" width="22" class="faq-ic text-[#c49a4a] transition-transform"></iconify-icon></button><div class="faq-body px-6"><p class="text-[#1f1b13]/65 text-sm font-light pb-6">Anda dapat menghubungi WhatsApp Meka Asia untuk menjadwalkan kunjungan kantor atau site visit ke project yang diminati.</p></div></div>
    </div>
  </div>
</section>

<!-- RESERVE -->
<section id="reserve" class="relative overflow-hidden">
  <div class="absolute inset-0" style="z-index:0">
    ${mediaPicture({
      name: "consultation-pool",
      alt: "Private pool at Meka Asia residence",
      className: "absolute inset-0 block w-full h-full",
      imgClass: "w-full h-full object-cover object-center",
      sizes: "100vw",
      loading: "lazy",
      widths: [480, 768, 1280],
    })}
    <div class="absolute inset-0" style="background:linear-gradient(to right,rgba(15,30,22,.9),rgba(15,30,22,.55))"></div>
  </div>
  <div class="gl-fallback absolute inset-0" style="z-index:1;background:radial-gradient(ellipse at 70% 30%,rgba(196,154,74,.14),transparent 50%)" aria-hidden="true"></div>
  <canvas id="resGl" class="gl-canvas absolute inset-0 w-full h-full" style="z-index:1;mix-blend-mode:screen;opacity:.4" aria-hidden="true" data-webgl="reserve"></canvas>
  <div class="relative grid lg:grid-cols-2 gap-12 items-center" style="z-index:3;padding:clamp(70px,10vw,140px) clamp(20px,5vw,84px)">
    <div>
      <span class="rv text-[#c49a4a] text-xs tracking-[0.3em] uppercase font-medium mb-5 block">Consultation</span>
      <h2 class="wipe pf text-[#fcf9f3] font-medium tracking-tight leading-[1.1] mb-7" style="font-size:clamp(2rem,4.5vw,3.4rem);text-shadow:0 2px 16px rgba(0,0,0,.4)">Start Your Property Journey in Lombok</h2>
      <p class="rv text-white/80 text-sm md:text-base font-light max-w-lg">Speak with the Meka Asia Property team and discover the right project for your lifestyle or investment goals.</p>
      <a href="/simulasi-kpr" class="rv mt-8 inline-flex items-center gap-3 rounded-full border border-[#c49a4a]/60 px-6 py-3 text-sm font-medium text-[#e0c783] transition hover:border-white hover:bg-white hover:text-[#173426]">Simulasi KPR Mandiri <span aria-hidden="true">&rarr;</span></a>
    </div>
    <div class="rv bg-white/5 backdrop-blur-sm border border-white/15 rounded-xl p-8 md:p-10">
      <form id="consultForm" class="space-y-7" novalidate>
        <div><label class="text-white/50 text-xs tracking-wide uppercase block mb-2" for="consult-name">Name</label><input id="consult-name" name="name" type="text" placeholder="Your full name" autocomplete="name" class="w-full bg-transparent text-white text-sm py-2 outline-none placeholder-white/30" style="border-bottom:1px solid rgba(255,255,255,.4)"></div>
        <div><label class="text-white/50 text-xs tracking-wide uppercase block mb-2" for="consult-phone">Phone / WhatsApp</label><input id="consult-phone" name="phone" type="tel" placeholder="+62 ..." autocomplete="tel" class="w-full bg-transparent text-white text-sm py-2 outline-none placeholder-white/30" style="border-bottom:1px solid rgba(255,255,255,.4)"></div>
        <div><label class="text-white/50 text-xs tracking-wide uppercase block mb-2" for="consult-project">Preferred Project</label><input id="consult-project" name="project" type="text" placeholder="Living Asia, Lavida, Green Asia..." class="w-full bg-transparent text-white text-sm py-2 outline-none placeholder-white/30" style="border-bottom:1px solid rgba(255,255,255,.4)"></div>
        <div><label class="text-white/50 text-xs tracking-wide uppercase block mb-2" for="consult-message">Message</label><textarea id="consult-message" name="message" rows="2" placeholder="Tell us about your goals" class="w-full bg-transparent text-white text-sm py-2 outline-none placeholder-white/30 resize-none" style="border-bottom:1px solid rgba(255,255,255,.4)"></textarea></div>
        <button type="submit" class="btn w-full bg-[#c49a4a] text-[#173426] text-sm font-semibold tracking-wide py-4 rounded-full flex items-center justify-center gap-2 hover:bg-white">Consult via WhatsApp <span class="arw">&rarr;</span></button>
      </form>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="bg-[#173426] px-5 py-12 text-[#e0c783] sm:px-8">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-10 border-b border-[#e0c783]/20 pb-10 md:grid-cols-[1.35fr_0.9fr_1.25fr]">
      <div>
        <img src="/brand/meka-asia-logo-footer-white.png" width="220" height="44" class="h-11 w-auto object-contain mb-6" alt="Meka Asia Property" loading="lazy" decoding="async">
      </div>

      <div>
        <h4 class="text-xs font-semibold uppercase tracking-[0.24em] text-[#e0c783]">Portfolio</h4>
        <div class="mt-5 flex flex-col gap-3 text-sm text-[#e0c783]/70">
          <span>Living Asia</span>
          <span>Green Asia</span>
          <span>Green Tamarin</span>
          <span>Polinesia</span>
          <span>Lavida</span>
          <span>Melanesia</span>
        </div>
      </div>

      <div>
        <h4 class="text-xs font-semibold uppercase tracking-[0.24em] text-[#e0c783]">Office</h4>
        <div class="mt-5 grid gap-5 text-sm leading-6 text-[#e0c783]/70">
          <div>
            <p class="text-[#e0c783]">Whatsapp</p>
            <a href="https://wa.me/6281931151888" class="transition hover:text-[#e0c783]">+62 819 3115 1888</a>
          </div>
          <div>
            <p class="text-[#e0c783]">Kantor</p>
            <p>09.00 - 17.00, Senin - Sabtu</p>
          </div>
          <div>
            <p class="text-[#e0c783]">Alamat</p>
            <p>Jl. Raden Abdul Rahman, Bagik Polak, Labuapi, Lombok Barat</p>
          </div>
          <div>
            <p class="text-[#e0c783]">Email</p>
            <a href="mailto:mekaasia.lop@gmail.com" class="transition hover:text-[#e0c783]">mekaasia.lop@gmail.com</a>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4 pt-6 text-sm text-[#e0c783]/60 md:flex-row md:items-center md:justify-between">
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <a href="/simulasi-kpr" class="transition hover:text-[#e0c783]">Simulasi KPR Mandiri</a>
        <a href="#" class="transition hover:text-[#e0c783]">Kebijakan Privasi</a>
        <a href="#" class="transition hover:text-[#e0c783]">Syarat &amp; Ketentuan</a>
      </div>
      <p>Copyright 2026 Meka Asia Property</p>
    </div>
  </div>
</footer>
`;
}

/**
 * Single source of truth for motion modes (see fix-gsap.md).
 * WebGL off by default — enable via motionConfig / ENABLE_WEBGL without code changes elsewhere.
 */
const ENABLE_WEBGL = false;

const motionConfig = {
  mobile: {
    smoothScroll: false,
    parallaxYPercent: 2,
    cinematic: "sticky",
    webgl: false,
    heroVideo: false,
  },
  desktop: {
    smoothScroll: true,
    parallaxYPercent: 5,
    cinematic: "sticky",
    webgl: ENABLE_WEBGL,
    heroVideo: false,
  },
};

const MQ = {
  reduced: "(prefers-reduced-motion: reduce)",
  mobile: "(max-width: 767px)",
  desktop: "(min-width: 768px)",
  desktopFine: "(min-width: 768px) and (pointer: fine)",
};

const FILM_TIMES = ["07:00", "10:00", "12:00", "16:00", "19:00"];
const FILM_LABELS = [
  "Morning at Home",
  "Entrance Walkthrough",
  "Living Room",
  "Poolside Afternoon",
  "Future Secured",
];

/** Pacing + motion for One Day With Meka Asia (CSS sticky, no pin). */
const cinematicConfig = {
  mobile: {
    imageScale: 1.015,
    imagePan: 8,
  },
  desktop: {
    imageScale: 1.025,
    imagePan: 16,
  },
};

/**
 * Hold / crossfade timeline (fraction of wrapper scroll progress).
 * Hold ~12%, crossfade ~8%, ending hold ~20%.
 */
const FILM_SEGMENTS = [
  { kind: "hold", scene: 0, a: 0, b: 0.12 },
  { kind: "fade", from: 0, to: 1, a: 0.12, b: 0.2 },
  { kind: "hold", scene: 1, a: 0.2, b: 0.32 },
  { kind: "fade", from: 1, to: 2, a: 0.32, b: 0.4 },
  { kind: "hold", scene: 2, a: 0.4, b: 0.52 },
  { kind: "fade", from: 2, to: 3, a: 0.52, b: 0.6 },
  { kind: "hold", scene: 3, a: 0.6, b: 0.72 },
  { kind: "fade", from: 3, to: 4, a: 0.72, b: 0.8 },
  { kind: "hold", scene: 4, a: 0.8, b: 1 },
];

/** Active window per slide for push-in (entrance fade or 0 → exit fade or 1). */
const FILM_PUSH_WINDOWS = [
  { start: 0, end: 0.2 },
  { start: 0.12, end: 0.4 },
  { start: 0.32, end: 0.6 },
  { start: 0.52, end: 0.8 },
  { start: 0.72, end: 1 },
];

function resolveFilmSegment(progress) {
  const p = Math.min(1, Math.max(0, progress));
  for (let i = 0; i < FILM_SEGMENTS.length; i++) {
    const seg = FILM_SEGMENTS[i];
    if (p < seg.b || i === FILM_SEGMENTS.length - 1) {
      const span = seg.b - seg.a || 1;
      const t = Math.min(1, Math.max(0, (p - seg.a) / span));
      return { seg, t, progress: p };
    }
  }
  const last = FILM_SEGMENTS[FILM_SEGMENTS.length - 1];
  return { seg: last, t: 1, progress: p };
}

function setMotionAttr(mode) {
  document.documentElement.setAttribute("data-motion", mode);
}

/**
 * Single RAF WebGL manager — only when feature flag allows.
 * Caps ~30 FPS, low DPR, pauses offscreen / hidden tab.
 */
function createGlManager() {
  const instances = new Set();
  let rafId = null;
  let destroyed = false;
  let lastFrame = 0;
  const minFrameMs = 1000 / 30;

  const loop = (time) => {
    if (destroyed) return;
    if (document.hidden) {
      rafId = null;
      return;
    }
    if (time - lastFrame < minFrameMs) {
      rafId = requestAnimationFrame(loop);
      return;
    }
    lastFrame = time;
    let any = false;
    instances.forEach((inst) => {
      if (inst.visible && inst.enabled) {
        inst.draw(time);
        any = true;
      }
    });
    rafId = any ? requestAnimationFrame(loop) : null;
  };

  const kick = () => {
    if (!rafId && !destroyed && !document.hidden) {
      rafId = requestAnimationFrame(loop);
    }
  };

  const onVisibility = () => {
    if (!document.hidden) kick();
  };

  document.addEventListener("visibilitychange", onVisibility);

  const mount = (canvas) => {
    if (!canvas || destroyed) return () => {};

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return () => {};

    const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    const fs = `precision mediump float;uniform float t;uniform vec2 r;
      void main(){
        vec2 uv=gl_FragCoord.xy/r.xy;
        vec2 q=uv*6.0;
        float c=0.0;
        for(int i=0;i<4;i++){
          float fi=float(i);
          c+=sin(t*0.5+q.y+fi*1.3)*0.5+0.5;
          q+=vec2(sin(q.y*0.6+t*0.3),cos(q.x*0.6+t*0.2))*0.4;
        }
        c=pow(c/4.0,3.0);
        vec3 col=mix(vec3(0.12,0.25,0.18),vec3(0.77,0.60,0.29),c);
        gl_FragColor=vec4(col*c,c*0.6);
      }`;

    const makeShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const program = gl.createProgram();
    const vsh = makeShader(gl.VERTEX_SHADER, vs);
    const fsh = makeShader(gl.FRAGMENT_SHADER, fs);
    gl.attachShader(program, vsh);
    gl.attachShader(program, fsh);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(program, "t");
    const uR = gl.getUniformLocation(program, "r");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const maxDpr = Math.min(window.devicePixelRatio || 1, 0.85);

    const resize = () => {
      const dpr = maxDpr;
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const inst = {
      visible: false,
      enabled: true,
      draw(time) {
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1f(uT, time * 0.001);
        gl.uniform2f(uR, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inst.visible = !!entry?.isIntersecting;
        if (inst.visible) {
          resize();
          kick();
        }
      },
      { rootMargin: "10% 0px", threshold: 0.01 }
    );
    io.observe(canvas);

    const onResize = () => {
      if (inst.visible) resize();
    };
    window.addEventListener("resize", onResize);

    instances.add(inst);
    resize();

    return () => {
      instances.delete(inst);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vsh);
      gl.deleteShader(fsh);
      gl.deleteProgram(program);
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
  };

  const destroy = () => {
    destroyed = true;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    document.removeEventListener("visibilitychange", onVisibility);
    instances.clear();
  };

  return { mount, destroy };
}

function setSlideActive(el, active) {
  if (!el) return;
  el.classList.toggle("is-active", active);
  el.classList.toggle("is-idle", !active);
  el.style.visibility = active ? "visible" : "hidden";
  el.style.pointerEvents = active ? "auto" : "none";
}

async function decodeSlideMedia(slide) {
  if (!slide) return;
  const img = slide.querySelector("img");
  if (img && typeof img.decode === "function") {
    try {
      if (!img.complete) await img.decode();
    } catch {
      /* ignore decode failures */
    }
  }
}

export default function HomeClient({ newsSectionHtml = "" }) {
  const pageMarkup = useMemo(
    () => buildPageMarkup(newsSectionHtml),
    [newsSectionHtml]
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Mobile URL bar show/hide shouldn't constantly reflow sticky cinematic.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const cleanups = [];
    const removers = [];
    let lenis = null;
    let lenisTicker = null;
    let lenisScrollHandler = null;
    let heroTimer = null;
    let glManager = null;
    let heroIndex = 0;
    let heroInView = true;
    let heroAllowed = true;
    let allowHeroVideo = true;
    let videoUnlocked = false;

    const on = (target, type, handler, opts) => {
      target.addEventListener(type, handler, opts);
      removers.push(() => target.removeEventListener(type, handler, opts));
    };

    const scope = document;
    const ctx = gsap.context(() => {
      const nav = document.getElementById("nav");
      const mobileMenuToggle = document.getElementById("mobileMenuToggle");
      const mobileMenuIcon = document.getElementById("mobileMenuIcon");
      const mobileNavPanel = document.getElementById("mobileNavPanel");
      const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");
      const heroSlides = gsap.utils.toArray(".hero-slide");
      const heroDots = gsap.utils.toArray(".hero-dot");
      const heroVideo = document.getElementById("heroVideo");
      const heroPoster = document.getElementById("heroPoster");
      const HERO_INTERVAL = 5500;

      // ---- Mobile navigation ----
      let mobileMenuOpen = false;
      const setMobileMenu = (open, { returnFocus = false } = {}) => {
        if (!mobileMenuToggle || !mobileNavPanel || !mobileNavBackdrop) return;
        mobileMenuOpen = open;
        mobileMenuToggle.setAttribute("aria-expanded", String(open));
        mobileMenuToggle.setAttribute(
          "aria-label",
          open ? "Tutup menu navigasi" : "Buka menu navigasi"
        );
        mobileNavPanel.setAttribute("aria-hidden", String(!open));
        mobileNavBackdrop.setAttribute("aria-hidden", String(!open));
        mobileNavPanel.classList.toggle("is-open", open);
        mobileNavBackdrop.classList.toggle("is-open", open);
        document.documentElement.classList.toggle("mobile-menu-open", open);
        if (open) mobileNavPanel.removeAttribute("inert");
        else mobileNavPanel.setAttribute("inert", "");
        mobileMenuIcon?.setAttribute(
          "icon",
          open ? "solar:close-circle-linear" : "solar:hamburger-menu-linear"
        );

        if (open) {
          window.requestAnimationFrame(() =>
            mobileNavPanel.querySelector("a")?.focus({ preventScroll: true })
          );
        } else if (returnFocus) {
          mobileMenuToggle.focus({ preventScroll: true });
        }
      };

      if (mobileMenuToggle && mobileNavPanel && mobileNavBackdrop) {
        on(mobileMenuToggle, "click", () =>
          setMobileMenu(!mobileMenuOpen)
        );
        on(mobileNavBackdrop, "click", () =>
          setMobileMenu(false, { returnFocus: true })
        );
        mobileNavPanel.querySelectorAll("a").forEach((link) => {
          on(link, "click", () => setMobileMenu(false));
        });
        on(document, "keydown", (event) => {
          if (!mobileMenuOpen) return;
          if (event.key === "Escape") {
            event.preventDefault();
            setMobileMenu(false, { returnFocus: true });
            return;
          }
          if (event.key !== "Tab") return;

          const focusable = [
            mobileMenuToggle,
            ...mobileNavPanel.querySelectorAll("a[href]"),
          ];
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        });
        const desktopMenuMq = window.matchMedia("(min-width: 768px)");
        on(desktopMenuMq, "change", (event) => {
          if (event.matches) setMobileMenu(false);
        });
        cleanups.push(() => setMobileMenu(false));
      }

      // Only current + next compositor layers
      heroSlides.forEach((slide, i) => {
        setSlideActive(slide, i === 0);
        gsap.set(slide, { opacity: i === 0 ? 1 : 0 });
      });

      const syncHeroVideo = () => {
        if (!heroVideo) return;
        const shouldPlay =
          allowHeroVideo &&
          videoUnlocked &&
          heroIndex === 0 &&
          heroInView &&
          !document.hidden &&
          heroAllowed;

        if (shouldPlay) {
          heroPoster?.classList.add("is-hidden");
          heroVideo.play?.().catch(() => {});
        } else {
          heroVideo.pause?.();
          if (!allowHeroVideo || !videoUnlocked || heroIndex !== 0) {
            heroPoster?.classList.remove("is-hidden");
          }
        }
      };

      const goToHeroSlide = async (nextIndex, { force = false } = {}) => {
        if (!heroSlides.length) return;
        const index =
          ((nextIndex % heroSlides.length) + heroSlides.length) % heroSlides.length;
        if (index === heroIndex && !force) return;

        const prev = heroIndex;
        const leave = heroSlides[prev];
        const enter = heroSlides[index];
        const nextAfter = heroSlides[(index + 1) % heroSlides.length];

        // Prefetch/decode next before crossfade
        await decodeSlideMedia(enter);

        setSlideActive(leave, true);
        setSlideActive(enter, true);
        // Hide all others
        heroSlides.forEach((s, i) => {
          if (i !== prev && i !== index) setSlideActive(s, false);
        });

        if (leave && leave !== enter) {
          gsap.to(leave, {
            opacity: 0,
            duration: 1.05,
            ease: "power2.inOut",
            overwrite: "auto",
            onComplete: () => {
              if (heroIndex !== prev) setSlideActive(leave, false);
            },
          });
        }
        if (enter) {
          gsap.to(enter, {
            opacity: 1,
            duration: 1.05,
            ease: "power2.inOut",
            overwrite: "auto",
          });
        }

        // Warm next slide media (idle)
        if (nextAfter && nextAfter !== enter) {
          decodeSlideMedia(nextAfter);
        }

        heroDots.forEach((dot, i) => {
          const isOn = i === index;
          dot.classList.toggle("is-active", isOn);
          dot.setAttribute("aria-selected", isOn ? "true" : "false");
        });

        heroIndex = index;
        syncHeroVideo();
      };

      const stopHeroAutoplay = () => {
        if (heroTimer) {
          clearInterval(heroTimer);
          heroTimer = null;
        }
      };

      const startHeroAutoplay = () => {
        stopHeroAutoplay();
        if (!heroAllowed || heroSlides.length < 2) return;
        if (!heroInView || document.hidden) return;
        heroTimer = setInterval(() => {
          void goToHeroSlide(heroIndex + 1);
        }, HERO_INTERVAL);
      };

      // Desktop: unlock video on first gesture-free if allowed; mobile waits for interaction
      const unlockVideo = () => {
        if (videoUnlocked) return;
        videoUnlocked = true;
        if (heroVideo && allowHeroVideo) {
          heroVideo.preload = "metadata";
          heroVideo.load?.();
        }
        syncHeroVideo();
      };

      if (allowHeroVideo) {
        // Desktop will set allowHeroVideo true and unlock immediately in matchMedia
      }

      heroDots.forEach((dot) => {
        const onDot = () => {
          const index = Number(dot.getAttribute("data-hero-index"));
          if (Number.isNaN(index)) return;
          if (index === 0) unlockVideo();
          void goToHeroSlide(index, { force: true });
          startHeroAutoplay();
        };
        on(dot, "click", onDot);
      });

      // Mobile: video only after user interaction
      on(document, "pointerdown", () => {
        if (!allowHeroVideo) return;
        unlockVideo();
      }, { once: false, passive: true });

      const homeEl = document.getElementById("home");
      if (homeEl && "IntersectionObserver" in window) {
        const heroIo = new IntersectionObserver(
          ([entry]) => {
            heroInView = !!entry?.isIntersecting;
            if (heroInView) {
              startHeroAutoplay();
              syncHeroVideo();
            } else {
              stopHeroAutoplay();
              heroVideo?.pause?.();
            }
          },
          { threshold: 0.15 }
        );
        heroIo.observe(homeEl);
        cleanups.push(() => heroIo.disconnect());
      }

      on(document, "visibilitychange", () => {
        if (document.hidden) {
          stopHeroAutoplay();
          heroVideo?.pause?.();
        } else {
          startHeroAutoplay();
          syncHeroVideo();
        }
      });

      // ---- FAQ ----
      document.querySelectorAll(".faq-head").forEach((head) => {
        const onFaq = () => {
          const item = head.parentElement;
          document.querySelectorAll(".faq-item").forEach((faqItem) => {
            if (faqItem !== item) faqItem.classList.remove("open");
          });
          item?.classList.toggle("open");
        };
        on(head, "click", onFaq);
      });

      // ---- Consultation form → WhatsApp with filled text ----
      const consultForm = document.getElementById("consultForm");
      if (consultForm) {
        const onConsultSubmit = (event) => {
          event.preventDefault();
          const data = new FormData(consultForm);
          const name = String(data.get("name") || "").trim();
          const phone = String(data.get("phone") || "").trim();
          const project = String(data.get("project") || "").trim();
          const message = String(data.get("message") || "").trim();

          const lines = [
            "Halo Meka Asia, saya ingin konsultasi properti.",
            name ? `Nama: ${name}` : null,
            phone ? `WhatsApp: ${phone}` : null,
            project ? `Proyek yang diminati: ${project}` : null,
            message ? `Pesan: ${message}` : null,
          ].filter(Boolean);

          const url = `https://wa.me/6281931151888?text=${encodeURIComponent(lines.join("\n"))}`;
          window.open(url, "_blank", "noopener,noreferrer");
        };
        on(consultForm, "submit", onConsultSubmit);
      }

      // ---- Anchor links ----
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        const onAnchor = (event) => {
          const href = anchor.getAttribute("href");
          if (!href || href === "#") return;
          const target = document.querySelector(href);
          if (!target) return;
          event.preventDefault();
          if (lenis) {
            lenis.scrollTo(target, { offset: 0 });
          } else {
            target.scrollIntoView({ behavior: "smooth" });
          }
        };
        on(anchor, "click", onAnchor);
      });

      // ---- Marquee pause when offscreen / hidden ----
      const marquee = document.querySelector(".brand-marquee-shell");
      if (marquee && "IntersectionObserver" in window) {
        const setPaused = (paused) => marquee.classList.toggle("is-paused", paused);
        const mqIo = new IntersectionObserver(
          ([entry]) => setPaused(!entry?.isIntersecting || document.hidden),
          { threshold: 0.05 }
        );
        mqIo.observe(marquee);
        cleanups.push(() => mqIo.disconnect());
        on(document, "visibilitychange", () => {
          if (document.hidden) setPaused(true);
          else setPaused(false);
        });
      }

      /**
       * Scroll reveals.
       * Mobile: IntersectionObserver (reliable with native touch scroll / iOS chrome).
       * Desktop: ScrollTrigger fromTo.
       * Returns teardown for observers/timeouts (matchMedia does not clean those).
       */
      const setupReveals = (isMobile) => {
        const yFrom = isMobile ? 20 : 28;
        const duration = isMobile ? 0.75 : 1.05;
        const localCleanups = [];

        gsap.set(".ln>span", { yPercent: 115 });
        gsap.to(".ln>span", {
          yPercent: 0,
          duration: isMobile ? 0.85 : 1.1,
          stagger: 0.08,
          ease: "power4.out",
          delay: 0.12,
        });

        document.querySelectorAll(".on-light").forEach((sec) => {
          ScrollTrigger.create({
            trigger: sec,
            start: "top 70px",
            end: "bottom 70px",
            onToggle: (self) => nav?.classList.toggle("on-light", self.isActive),
          });
        });

        const rvs = gsap.utils.toArray(".rv");
        const wipes = gsap.utils.toArray(".wipe");

        // GSAP owns transform — avoids CSS transform fighting y tweens
        gsap.set(rvs, { opacity: 0, y: yFrom, force3D: true });
        gsap.set(wipes, {
          opacity: 0,
          y: isMobile ? 14 : 12,
          clipPath: isMobile ? "none" : "inset(0 0 100% 0)",
          force3D: true,
        });

        const markStarted = (el) => {
          el.dataset.revealed = "1";
        };

        const markFinished = (el) => {
          el.classList.add("is-revealed");
          gsap.set(el, { clearProps: "willChange" });
        };

        const isDone = (el) => el.dataset.revealed === "1";

        const playRv = (el) => {
          if (!el || isDone(el)) return;
          markStarted(el);
          gsap.fromTo(
            el,
            { opacity: 0, y: yFrom },
            {
              opacity: 1,
              y: 0,
              duration,
              ease: "power3.out",
              overwrite: true,
              onComplete: () => markFinished(el),
            }
          );
        };

        const playWipe = (el) => {
          if (!el || isDone(el)) return;
          markStarted(el);
          if (isMobile) {
            gsap.fromTo(
              el,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.75,
                ease: "power3.out",
                overwrite: true,
                onComplete: () => markFinished(el),
              }
            );
          } else {
            gsap.fromTo(
              el,
              { opacity: 0, y: 12, clipPath: "inset(0 0 100% 0)" },
              {
                opacity: 1,
                y: 0,
                clipPath: "inset(0 0 -5% 0)",
                duration: 1,
                ease: "power3.out",
                overwrite: true,
                onComplete: () => markFinished(el),
              }
            );
          }
        };

        if (isMobile && typeof IntersectionObserver !== "undefined") {
          // rootMargin bottom negative = fire a bit before fully in view
          // threshold low so short absolute captions (#villa) still trigger
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                io.unobserve(el);
                if (el.classList.contains("wipe")) playWipe(el);
                else playRv(el);
              });
            },
            {
              root: null,
              // Fire when element enters lower ~88% of the screen (forgiving on mobile chrome)
              rootMargin: "0px 0px -8% 0px",
              threshold: [0, 0.05, 0.12],
            }
          );

          [...rvs, ...wipes].forEach((el) => io.observe(el));
          localCleanups.push(() => io.disconnect());

          // Address-bar / layout settle: re-check anything still hidden but on screen
          const rescue = () => {
            const vh = window.innerHeight || 0;
            [...rvs, ...wipes].forEach((el) => {
              if (isDone(el)) return;
              const rect = el.getBoundingClientRect();
              const visible =
                rect.bottom > 40 &&
                rect.top < vh * 0.96 &&
                rect.height > 0 &&
                rect.width > 0;
              if (!visible) return;
              if (el.classList.contains("wipe")) playWipe(el);
              else playRv(el);
            });
          };
          const t1 = setTimeout(rescue, 200);
          const t2 = setTimeout(rescue, 800);
          const onScrollRescue = () => {
            // cheap pass during first interactions only
            rescue();
          };
          window.addEventListener("scroll", onScrollRescue, { passive: true });
          window.addEventListener("resize", rescue, { passive: true });
          // Stop scroll rescue after first second of interaction window
          const stopRescue = setTimeout(() => {
            window.removeEventListener("scroll", onScrollRescue);
          }, 4000);

          localCleanups.push(() => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(stopRescue);
            window.removeEventListener("scroll", onScrollRescue);
            window.removeEventListener("resize", rescue);
          });
        } else {
          // Desktop (or no IO): ScrollTrigger-linked fromTo
          rvs.forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: yFrom },
              {
                opacity: 1,
                y: 0,
                duration,
                ease: "power3.out",
                immediateRender: false,
                onStart: () => markStarted(el),
                onComplete: () => markFinished(el),
                scrollTrigger: {
                  trigger: el,
                  start: "top 90%",
                  once: true,
                  invalidateOnRefresh: true,
                  toggleActions: "play none none none",
                },
              }
            );
          });

          wipes.forEach((el) => {
            gsap.fromTo(
              el,
              {
                opacity: 0,
                y: 12,
                clipPath: "inset(0 0 100% 0)",
              },
              {
                opacity: 1,
                y: 0,
                clipPath: "inset(0 0 -5% 0)",
                duration: 1,
                ease: "power3.out",
                immediateRender: false,
                onStart: () => markStarted(el),
                onComplete: () => markFinished(el),
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  once: true,
                  invalidateOnRefresh: true,
                  toggleActions: "play none none none",
                },
              }
            );
          });

          requestAnimationFrame(() => ScrollTrigger.refresh());
        }

        gsap.utils.toArray(".rule").forEach((el) => {
          if (isMobile && typeof IntersectionObserver !== "undefined") {
            gsap.set(el, { scaleY: 0 });
            const io = new IntersectionObserver(
              ([entry]) => {
                if (!entry?.isIntersecting) return;
                io.disconnect();
                gsap.to(el, { scaleY: 1, duration: 0.9, ease: "power2.out" });
              },
              { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
            );
            io.observe(el);
            localCleanups.push(() => io.disconnect());
          } else {
            gsap.fromTo(
              el,
              { scaleY: 0 },
              {
                scaleY: 1,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 85%",
                  once: true,
                  invalidateOnRefresh: true,
                },
              }
            );
          }
        });

        gsap.utils.toArray(".count").forEach((el) => {
          const end = Number(el.dataset.count);
          let done = false;
          const runCount = () => {
            if (done) return;
            done = true;
            const proxy = { v: 0 };
            gsap.to(proxy, {
              v: end,
              duration: 1.5,
              ease: "power2.out",
              onUpdate() {
                el.textContent = String(Math.round(proxy.v));
              },
              onComplete() {
                el.textContent = String(end);
              },
            });
          };

          if (isMobile && typeof IntersectionObserver !== "undefined") {
            const io = new IntersectionObserver(
              ([entry]) => {
                if (!entry?.isIntersecting) return;
                io.disconnect();
                runCount();
              },
              { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
            );
            io.observe(el);
            localCleanups.push(() => io.disconnect());
          } else {
            ScrollTrigger.create({
              trigger: el,
              start: "top 88%",
              once: true,
              invalidateOnRefresh: true,
              onEnter: runCount,
            });
          }
        });

        return () => {
          localCleanups.forEach((fn) => {
            try {
              fn();
            } catch {
              /* ignore */
            }
          });
        };
      };

      /** Transform-only parallax: yPercent only, scrub:true, will-change while active. */
      const setupParallax = (yPercent) => {
        const make = (target, trigger, fromY, toY) => {
          const el = typeof target === "string" ? document.querySelector(target) : target;
          if (!el) return;
          gsap.fromTo(
            el,
            { yPercent: fromY },
            {
              yPercent: toY,
              ease: "none",
              scrollTrigger: {
                trigger,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
                onToggle: (self) => {
                  el.style.willChange = self.isActive ? "transform" : "auto";
                },
              },
            }
          );
        };

        make("#heroMedia", "#home", 0, yPercent * 1.4);
        make("#whyMekaImg", "#why-meka", -yPercent, yPercent);
      };

      /**
       * CSS sticky cinematic — hold/crossfade timeline, max 2 slides,
       * transform-only push-in/pan, scaleX progress. No pin / no numeric scrub.
       */
      const setupCinematic = (mode = "desktop") => {
        const wrapper = document.getElementById("filmWrapper");
        const slides = gsap.utils.toArray("#filmStage .film-slide");
        const clock = document.getElementById("filmClock");
        const label = document.getElementById("filmLabel");
        const progressEl = document.getElementById("filmProg");
        if (!wrapper || !slides.length) return;

        const touchDevice =
          navigator.maxTouchPoints > 0 ||
          window.matchMedia?.("(pointer: coarse)").matches;
        if (
          window.__mekaFilmFallbackInstalled &&
          (touchDevice || mode === "mobile" || mode === "reduced")
        ) {
          return () => {};
        }

        const total = slides.length;
        const reducedMotion = mode === "reduced";
        const cfg = reducedMotion
          ? { imageScale: 1, imagePan: 0 }
          : mode === "mobile"
            ? cinematicConfig.mobile
            : cinematicConfig.desktop;
        const maxScale = cfg.imageScale;
        const panPx = cfg.imagePan;
        const startScale = 1 - (maxScale - 1) * 0.35;

        const setOpacity = slides.map((s) => gsap.quickSetter(s, "opacity"));
        const setX = slides.map((s) => gsap.quickSetter(s, "x", "px"));
        const setScale = slides.map((s) => gsap.quickSetter(s, "scale"));
        const setProgress = progressEl
          ? gsap.quickSetter(progressEl, "scaleX")
          : null;
        const setClockOp = clock ? gsap.quickSetter(clock, "opacity") : null;
        const setClockY = clock ? gsap.quickSetter(clock, "y", "px") : null;
        const setLabelOp = label ? gsap.quickSetter(label, "opacity") : null;
        const setLabelY = label ? gsap.quickSetter(label, "y", "px") : null;

        let activeFilmIndex = -1;
        let lastCur = -1;
        let lastNxt = -1;
        let lastOpCur = -1;
        let lastOpNxt = -1;
        let lastDecodedNext = -1;
        const textY = mode === "mobile" ? 10 : 12;

        slides.forEach((s, i) => {
          gsap.set(s, {
            opacity: i === 0 ? 1 : 0,
            scale: i === 0 ? 1 : startScale,
            x: 0,
            force3D: true,
          });
          setSlideActive(s, i === 0);
        });
        if (clock) gsap.set(clock, { opacity: 1, y: 0 });
        if (label) gsap.set(label, { opacity: 1, y: 0 });

        const applyPush = (i, p) => {
          const win = FILM_PUSH_WINDOWS[i];
          if (!win) return;
          const span = win.end - win.start || 1;
          const local = Math.min(1, Math.max(0, (p - win.start) / span));
          const scale = startScale + (maxScale - startScale) * local;
          const dir = i % 2 === 0 ? 1 : -1;
          setScale[i](scale);
          setX[i](dir * panPx * local);
        };

        const setTextScene = (index) => {
          if (clock) clock.textContent = FILM_TIMES[index] || "";
          if (label) label.textContent = FILM_LABELS[index] || "";
        };

        /** Clock/label enter at hold start; exit early during crossfade. */
        const applyTextMotion = (seg, t) => {
          if (reducedMotion) {
            setClockOp?.(1);
            setClockY?.(0);
            setLabelOp?.(1);
            setLabelY?.(0);
            return;
          }
          if (seg.kind === "hold") {
            // Enter over first ~18% of hold
            const enter = Math.min(1, t / 0.18);
            setClockOp?.(enter);
            setClockY?.(textY * (1 - enter));
            setLabelOp?.(enter);
            setLabelY?.(textY * (1 - enter));
            return;
          }
          // Fade out in first 55% of crossfade (before image crossfade ends)
          const exit = Math.min(1, t / 0.55);
          setClockOp?.(1 - exit);
          setClockY?.(-textY * 0.5 * exit);
          setLabelOp?.(1 - exit);
          setLabelY?.(-textY * 0.5 * exit);
        };

        const renderProgress = (progress) => {
            const { seg, t, progress: p } = resolveFilmSegment(progress);

            let cur;
            let nxt;
            let opCur;
            let opNxt;

            if (seg.kind === "hold") {
              cur = seg.scene;
              nxt = Math.min(total - 1, cur + 1);
              opCur = 1;
              opNxt = 0;
            } else {
              cur = seg.from;
              nxt = seg.to;
              opCur = 1 - t;
              opNxt = t;
            }

            // iOS can inherit the system's Reduce Motion preference. Keep the
            // story scroll-driven, but switch scenes discretely instead of
            // freezing the cinematic on its first (07:00) frame.
            if (reducedMotion) {
              const scene = opNxt > opCur ? nxt : cur;
              for (let i = 0; i < total; i++) {
                const active = i === scene;
                setSlideActive(slides[i], active);
                setOpacity[i](active ? 1 : 0);
                setScale[i](1);
                setX[i](0);
              }
              if (scene !== activeFilmIndex) {
                activeFilmIndex = scene;
                setTextScene(scene);
              }
              applyTextMotion(seg, t);
              setProgress?.(p);
              return;
            }

            // Quantize opacity writes to reduce style thrash
            const qCur = Math.round(opCur * 100);
            const qNxt = Math.round(opNxt * 100);

            if (cur !== lastCur || nxt !== lastNxt) {
              for (let i = 0; i < total; i++) {
                const on = i === cur || (i === nxt && opNxt > 0.001);
                setSlideActive(slides[i], on);
                if (!on) {
                  setOpacity[i](0);
                }
              }
              lastCur = cur;
              lastNxt = nxt;
              lastOpCur = -1;
              lastOpNxt = -1;
            }

            if (qCur !== lastOpCur) {
              lastOpCur = qCur;
              setOpacity[cur](opCur);
            }
            if (nxt !== cur && qNxt !== lastOpNxt) {
              lastOpNxt = qNxt;
              setOpacity[nxt](opNxt);
              setSlideActive(slides[nxt], opNxt > 0.001);
            }

            // Push-in / pan on the at-most two active slides
            applyPush(cur, p);
            if (nxt !== cur && opNxt > 0.001) applyPush(nxt, p);

            // Label follows dominant slide (mobile flicks skip intermediate frames).
            const textScene = opNxt > opCur ? nxt : cur;
            if (textScene !== activeFilmIndex) {
              activeFilmIndex = textScene;
              setTextScene(textScene);
            }

            const prefetch = Math.min(total - 1, textScene + 1);
            if (
              prefetch > textScene &&
              prefetch !== lastDecodedNext &&
              (seg.kind === "hold" ? t > 0.5 : t > 0.35)
            ) {
              lastDecodedNext = prefetch;
              void decodeSlideMedia(slides[prefetch]);
            }

            applyTextMotion(seg, t);
            setProgress?.(p);
        };

        let teardownDriver;

        if (mode === "mobile" || reducedMotion || touchDevice) {
          // ScrollTrigger's cached measurements can stay at progress 0 on real
          // iOS Safari when the dynamic browser chrome or Reduce Motion changes
          // the visual viewport. Read the sticky wrapper directly instead.
          let rafId = 0;
          const viewport = window.visualViewport;
          const stage = document.getElementById("filmStage");
          let scrollRange = 1;

          const updateFromNativeScroll = () => {
            rafId = 0;
            renderProgress(-wrapper.getBoundingClientRect().top / scrollRange);
          };

          const requestNativeUpdate = () => {
            if (!rafId) rafId = window.requestAnimationFrame(updateFromNativeScroll);
          };

          const measureNativeRange = () => {
            scrollRange = Math.max(
              1,
              wrapper.offsetHeight - (stage?.offsetHeight || window.innerHeight)
            );
            requestNativeUpdate();
          };

          window.addEventListener("scroll", requestNativeUpdate, { passive: true });
          window.addEventListener("resize", measureNativeRange, { passive: true });
          window.addEventListener("orientationchange", measureNativeRange);
          viewport?.addEventListener("resize", measureNativeRange, { passive: true });
          measureNativeRange();

          teardownDriver = () => {
            if (rafId) window.cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", requestNativeUpdate);
            window.removeEventListener("resize", measureNativeRange);
            window.removeEventListener("orientationchange", measureNativeRange);
            viewport?.removeEventListener("resize", measureNativeRange);
          };
        } else {
          const trigger = ScrollTrigger.create({
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => renderProgress(self.progress),
          });
          teardownDriver = () => trigger.kill();
        }

        // Decode first + second slide early
        void decodeSlideMedia(slides[0]);
        void decodeSlideMedia(slides[1]);
        return teardownDriver;
      };

      const destroyLenis = () => {
        if (lenisScrollHandler && lenis) {
          lenis.off("scroll", lenisScrollHandler);
          lenisScrollHandler = null;
        }
        if (lenisTicker) {
          gsap.ticker.remove(lenisTicker);
          lenisTicker = null;
        }
        lenis?.destroy();
        lenis = null;
        gsap.ticker.lagSmoothing(500, 33);
      };

      const setupLenis = () => {
        destroyLenis();
        lenis = new Lenis({
          lerp: 0.12,
          wheelMultiplier: 1,
          touchMultiplier: 1,
          syncTouch: false,
        });
        lenisScrollHandler = () => ScrollTrigger.update();
        lenis.on("scroll", lenisScrollHandler);
        lenisTicker = (time) => {
          lenis?.raf(time * 1000);
        };
        gsap.ticker.add(lenisTicker);
        gsap.ticker.lagSmoothing(0);
      };

      const mm = gsap.matchMedia();

      // Reduced motion
      mm.add(MQ.reduced, () => {
        setMotionAttr("reduced");
        heroAllowed = false;
        allowHeroVideo = false;
        stopHeroAutoplay();
        heroVideo?.pause?.();
        heroPoster?.classList.remove("is-hidden");
        gsap.set(".ln>span", { yPercent: 0 });
        gsap.set(".rv", { opacity: 1, y: 0, clearProps: "willChange" });
        gsap.set(".wipe", {
          opacity: 1,
          y: 0,
          clipPath: "none",
          clearProps: "willChange",
        });
        gsap.set(".rule", { scaleY: 1 });
        gsap.utils.toArray(".count").forEach((el) => {
          el.textContent = el.dataset.count || "0";
        });
        document.querySelectorAll(".gl-canvas").forEach((c) => {
          c.style.display = "none";
        });
        // Keep the story functional on devices with Reduce Motion enabled.
        // Slides change discretely, without push-in, pan, or crossfade motion.
        const teardownCinematic = setupCinematic("reduced");
        return () => {
          teardownCinematic?.();
          heroAllowed = true;
        };
      });

      // Mobile: native scroll + light transform parallax + sticky cinematic
      mm.add(`${MQ.mobile} and (prefers-reduced-motion: no-preference)`, () => {
        setMotionAttr("mobile");
        const cfg = motionConfig.mobile;
        heroAllowed = true;
        allowHeroVideo = cfg.heroVideo;
        videoUnlocked = false;
        heroPoster?.classList.remove("is-hidden");
        heroVideo?.pause?.();

        const teardownReveals = setupReveals(true);
        setupParallax(cfg.parallaxYPercent);
        const teardownCinematic = setupCinematic("mobile");
        startHeroAutoplay();

        let orientTimer = null;
        const onOrient = () => {
          clearTimeout(orientTimer);
          orientTimer = setTimeout(() => ScrollTrigger.refresh(), 280);
        };
        window.addEventListener("orientationchange", onOrient);
        // visualViewport fires when mobile browser chrome shows/hides
        const vv = window.visualViewport;
        const onVv = () => {
          clearTimeout(orientTimer);
          orientTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
        };
        vv?.addEventListener("resize", onVv);
        const bootRefresh = setTimeout(() => ScrollTrigger.refresh(), 350);

        return () => {
          teardownCinematic?.();
          teardownReveals?.();
          stopHeroAutoplay();
          clearTimeout(orientTimer);
          clearTimeout(bootRefresh);
          window.removeEventListener("orientationchange", onOrient);
          vv?.removeEventListener("resize", onVv);
        };
      });

      // Desktop (all pointers): parallax + sticky cinematic + optional WebGL
      mm.add(`${MQ.desktop} and (prefers-reduced-motion: no-preference)`, () => {
        setMotionAttr("desktop");
        const cfg = motionConfig.desktop;
        heroAllowed = true;
        allowHeroVideo = cfg.heroVideo;
        if (cfg.heroVideo) {
          videoUnlocked = true;
          if (heroVideo) {
            heroVideo.preload = "metadata";
          }
          heroPoster?.classList.add("is-hidden");
          syncHeroVideo();
        }

        const teardownReveals = setupReveals(false);
        setupParallax(cfg.parallaxYPercent);
        const teardownCinematic = setupCinematic("desktop");
        startHeroAutoplay();

        const glCleanups = [];
        if (cfg.webgl) {
          glManager = createGlManager();
          glCleanups.push(glManager.mount(document.getElementById("heroGl")));
          glCleanups.push(glManager.mount(document.getElementById("resGl")));
          document.documentElement.setAttribute("data-webgl", "on");
        } else {
          document.documentElement.setAttribute("data-webgl", "off");
          document.querySelectorAll(".gl-canvas").forEach((c) => {
            c.style.display = "none";
          });
        }

        // One refresh after fonts/media settle
        const refreshOnce = () => ScrollTrigger.refresh();
        if (document.fonts?.ready) {
          document.fonts.ready.then(refreshOnce).catch(() => {});
        }
        const bootRefresh = setTimeout(refreshOnce, 400);

        return () => {
          teardownCinematic?.();
          teardownReveals?.();
          stopHeroAutoplay();
          clearTimeout(bootRefresh);
          glCleanups.forEach((fn) => fn?.());
          glManager?.destroy();
          glManager = null;
        };
      });

      // Lenis only: desktop + fine pointer (no syncTouch)
      mm.add(
        `${MQ.desktopFine} and (prefers-reduced-motion: no-preference)`,
        () => {
          setupLenis();
          return () => destroyLenis();
        }
      );

      cleanups.push(() => mm.revert());
    }, scope);

    return () => {
      if (heroTimer) {
        clearInterval(heroTimer);
        heroTimer = null;
      }
      removers.forEach((fn) => fn());
      removers.length = 0;
      cleanups.forEach((fn) => {
        try {
          fn?.();
        } catch {
          /* ignore */
        }
      });
      cleanups.length = 0;
      if (lenisScrollHandler && lenis) {
        lenis.off("scroll", lenisScrollHandler);
        lenisScrollHandler = null;
      }
      if (lenisTicker) {
        gsap.ticker.remove(lenisTicker);
        lenisTicker = null;
      }
      lenis?.destroy();
      lenis = null;
      glManager?.destroy();
      glManager = null;
      ctx.revert();
    };
  }, []);

  return (
    <>
      <Script
        src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"
        strategy="afterInteractive"
      />
      <div dangerouslySetInnerHTML={{ __html: pageMarkup }} />
      <PromoPopup />
    </>
  );
}
