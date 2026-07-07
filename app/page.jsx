"use client";

import Script from "next/script";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const pageMarkup = String.raw`
<!-- NAV -->
<nav id="nav" class="nav-shell fixed flex items-center justify-between">
  <a href="#home" class="nav-logo flex items-center" aria-label="Meka Asia home">
    <img src="/brand/meka-asia-logo-new.png" class="nav-logo-img" alt="Meka Asia">
  </a>
  <div class="hidden md:flex items-center gap-8">
    <a href="#home" class="nav-txt text-xs tracking-wide uppercase font-medium">Home</a>
    <a href="#villa" class="nav-txt text-xs tracking-wide uppercase font-medium">About</a>
    <a href="#projects" class="nav-txt text-xs tracking-wide uppercase font-medium">Projects</a>
    <a href="#experience" class="nav-txt text-xs tracking-wide uppercase font-medium">Experience</a>
    <a href="#gallery" class="nav-txt text-xs tracking-wide uppercase font-medium">Gallery</a>
  </div>
  <a href="#reserve" class="nav-cta text-xs tracking-wide uppercase font-medium px-5 py-2.5 rounded-full flex items-center gap-2 transition">
    <iconify-icon icon="solar:chat-round-line-linear" width="16"></iconify-icon> Consult
  </a>
</nav>

<!-- HERO -->
<section id="home" class="relative h-screen overflow-hidden">
  <div class="absolute inset-0" style="z-index:0">
    <video id="heroMedia" class="w-full h-[120%] object-cover" autoplay muted loop playsinline preload="auto" poster="/entrance-living-asia-poster.jpg">
      <source src="/entrance-living-asia-lite.webm" type="video/webm">
    </video>
    <div class="absolute inset-0" style="background:radial-gradient(ellipse at center,rgba(23,52,38,.15) 0%,rgba(23,52,38,.55) 70%,rgba(15,30,22,.85) 100%)"></div>
  </div>
  <canvas id="heroGl" class="absolute inset-0 w-full h-full" style="z-index:1;mix-blend-mode:screen;opacity:.5"></canvas>
  <div class="relative h-full flex flex-col justify-center" style="z-index:3;padding:0 clamp(20px,5vw,84px)">
    <h1 class="text-[#fcf9f3] pf font-semibold tracking-tight leading-[0.95] mb-7" style="font-size:clamp(2.6rem,8vw,6.5rem);text-shadow:0 2px 20px rgba(0,0,0,.5)">
      <span class="ln"><span>Luxury Living</span></span>
      <span class="ln"><span class="italic text-[#e8d5a8]">in Lombok</span></span>
    </h1>
    <div class="ln max-w-xl mb-9"><span class="text-white/85 text-sm md:text-base font-light" style="text-shadow:0 1px 10px rgba(0,0,0,.6)">Premium residential developments crafted for comfort, trust, and long-term value.</span></div>
    <div class="flex flex-wrap gap-4">
      <a href="#reserve" class="btn bg-[#c49a4a] text-[#173426] text-xs md:text-sm font-semibold tracking-wide px-7 py-4 rounded-full flex items-center gap-2.5 hover:bg-white">
        <iconify-icon icon="solar:chat-round-line-linear" width="18"></iconify-icon> Consult via WhatsApp <span class="arw">&rarr;</span>
      </a>
      <a href="#projects" class="btn border border-white/50 text-white text-xs md:text-sm font-medium tracking-wide px-7 py-4 rounded-full flex items-center gap-2.5 hover:bg-white/10">
        View Projects <span class="arw">&rarr;</span>
      </a>
    </div>
  </div>
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style="z-index:3">
    <span class="text-white/60 text-[0.6rem] tracking-[0.3em] uppercase">Scroll</span>
    <iconify-icon icon="solar:alt-arrow-down-linear" width="18" class="text-white/60 animate-bounce"></iconify-icon>
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
        <figure class="brand-marquee-card"><img src="/logos/living-asia-marquee.png" alt="Living Asia"></figure>
        <figure class="brand-marquee-card"><img src="/logos/green-asia-marquee.png" alt="Green Asia"></figure>
        <figure class="brand-marquee-card"><img src="/logos/lavida-marquee.png" alt="Lavida"></figure>
        <figure class="brand-marquee-card"><img src="/logos/melanesia-marquee.png" alt="Melanesia"></figure>
        <figure class="brand-marquee-card"><img src="/logos/polinesia-marquee.png" alt="Polinesia"></figure>
        <figure class="brand-marquee-card" aria-hidden="true"><img src="/logos/living-asia-marquee.png" alt=""></figure>
        <figure class="brand-marquee-card" aria-hidden="true"><img src="/logos/green-asia-marquee.png" alt=""></figure>
        <figure class="brand-marquee-card" aria-hidden="true"><img src="/logos/lavida-marquee.png" alt=""></figure>
        <figure class="brand-marquee-card" aria-hidden="true"><img src="/logos/melanesia-marquee.png" alt=""></figure>
        <figure class="brand-marquee-card" aria-hidden="true"><img src="/logos/polinesia-marquee.png" alt=""></figure>
      </div>
    </div>
  </div>
</section>

<!-- FEATURE BLEED -->
<section id="villa" class="relative h-[80vh] md:h-screen overflow-hidden">
  <img id="bleedImg" src="/jaipur.jpg" class="fbleed-bg absolute w-full object-cover" alt="Jaipur residence exterior">
  <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(15,30,22,.7),transparent 60%)"></div>
  <div class="absolute bottom-0 left-0 max-w-lg" style="padding:clamp(30px,5vw,64px)">
    <p class="rv text-white pf text-xl md:text-3xl font-medium tracking-tight" style="text-shadow:0 2px 14px rgba(0,0,0,.6)">Arrive where comfort, design, and investment value meet.</p>
  </div>
</section>

<!-- SPLIT FEATURE -->
<section id="why-meka" class="on-light bg-[#fcf9f3] border-y border-[#e7ded0]">
  <div class="grid lg:grid-cols-[0.92fr_1.08fr] min-h-[92vh]">
    <div class="relative min-h-[58vh] lg:min-h-full overflow-hidden bg-[#173426]">
      <img id="whyMekaImg" src="/living-asia-entrance.jpg" class="w-full h-full object-cover object-center" alt="Living Asia entrance">
      <div class="absolute inset-0" style="background:linear-gradient(180deg,rgba(23,52,38,.04),rgba(23,52,38,.42))"></div>
      <div class="rv absolute left-6 right-6 bottom-6 md:left-10 md:right-10 md:bottom-10 text-white">
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

      <a href="#reserve" class="btn rv inline-flex w-fit items-center gap-3 rounded-full bg-[#204130] px-6 py-3 text-sm font-semibold text-[#fcf9f3] shadow-[0_18px_40px_rgba(23,52,38,.16)] hover:bg-[#c49a4a] hover:text-[#173426]">
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
      <img src="/living-asia-maldives-street.jpg" class="w-full h-full object-cover object-[88%_center]" alt="Living Asia residential neighborhood">
      <div class="absolute inset-0" style="background:linear-gradient(transparent,rgba(8,28,26,.66))"></div>
      <div class="absolute bottom-0 left-0 p-6"><h3 class="pf text-white text-2xl font-medium tracking-tight mb-1">Living Asia</h3><p class="text-white/70 text-xs font-light mb-3">A modern residential neighborhood with tropical streetscapes and everyday family comfort.</p><span class="text-[#c49a4a] text-xs font-semibold flex items-center gap-1.5">View Project <iconify-icon icon="solar:arrow-right-up-linear" width="14"></iconify-icon></span></div>
    </a>
    <a href="#reserve" class="pcard rv group relative overflow-hidden rounded-lg h-[380px] block">
      <img src="/lavida-show-unit.jpeg" class="w-full h-full object-cover object-center" alt="Lavida show unit exterior">
      <div class="absolute inset-0" style="background:linear-gradient(transparent,rgba(8,28,26,.66))"></div>
      <div class="absolute bottom-0 left-0 p-6"><h3 class="pf text-white text-2xl font-medium tracking-tight mb-1">Lavida</h3><p class="text-white/70 text-xs font-light mb-3">Compact modern homes with clean gable forms, green frontage, and practical daily comfort.</p><span class="text-[#c49a4a] text-xs font-semibold flex items-center gap-1.5">View Project <iconify-icon icon="solar:arrow-right-up-linear" width="14"></iconify-icon></span></div>
    </a>
    <a href="#reserve" class="pcard rv group relative overflow-hidden rounded-lg h-[380px] block">
      <img src="/melanesia-private-facade.jpeg" class="w-full h-full object-cover object-center" alt="Melanesia private residence facade">
      <div class="absolute inset-0" style="background:linear-gradient(transparent,rgba(8,28,26,.66))"></div>
      <div class="absolute bottom-0 left-0 p-6"><h3 class="pf text-white text-2xl font-medium tracking-tight mb-1">Melanesia</h3><p class="text-white/70 text-xs font-light mb-3">Private tropical homes with warm timber accents, clean lines, and calm residential streets.</p><span class="text-[#c49a4a] text-xs font-semibold flex items-center gap-1.5">View Project <iconify-icon icon="solar:arrow-right-up-linear" width="14"></iconify-icon></span></div>
    </a>
    <a href="#reserve" class="pcard rv group relative overflow-hidden rounded-lg h-[380px] block">
      <img src="/polinesia-gable-home.jpg" class="w-full h-full object-cover object-center" alt="Polinesia modern gable home">
      <div class="absolute inset-0" style="background:linear-gradient(transparent,rgba(8,28,26,.66))"></div>
      <div class="absolute bottom-0 left-0 p-6"><h3 class="pf text-white text-2xl font-medium tracking-tight mb-1">Polinesia</h3><p class="text-white/70 text-xs font-light mb-3">Modern gable homes with efficient layouts, warm facade details, and simple everyday access.</p><span class="text-[#c49a4a] text-xs font-semibold flex items-center gap-1.5">View Project <iconify-icon icon="solar:arrow-right-up-linear" width="14"></iconify-icon></span></div>
    </a>
    <a href="#reserve" class="pcard rv group relative overflow-hidden rounded-lg h-[380px] block">
      <img src="/green-asia-garden-home.jpg" class="w-full h-full object-cover object-center" alt="Green Asia garden residence">
      <div class="absolute inset-0" style="background:linear-gradient(transparent,rgba(8,28,26,.66))"></div>
      <div class="absolute bottom-0 left-0 p-6"><h3 class="pf text-white text-2xl font-medium tracking-tight mb-1">Green Asia</h3><p class="text-white/70 text-xs font-light mb-3">Garden-forward residences with soft green facades, natural shade, and relaxed daily living.</p><span class="text-[#c49a4a] text-xs font-semibold flex items-center gap-1.5">View Project <iconify-icon icon="solar:arrow-right-up-linear" width="14"></iconify-icon></span></div>
    </a>
    <a href="#reserve" class="rv relative overflow-hidden rounded-lg h-[380px] flex flex-col justify-center items-start p-8 bg-[#204130] border border-white/10 group">
      <iconify-icon icon="solar:map-point-linear" width="34" class="text-[#c49a4a] mb-5"></iconify-icon>
      <h3 class="pf text-white text-2xl font-medium tracking-tight mb-3">Discover Your Fit</h3>
      <p class="text-white/60 text-xs font-light mb-6">Let our team guide you to the right project for your goals.</p>
      <span class="btn bg-[#c49a4a] text-[#173426] text-xs font-semibold px-5 py-3 rounded-full flex items-center gap-2">Consult Now <span class="arw">&rarr;</span></span>
    </a>
  </div>
</section>

<!-- EXPERIENCE / CINEMATIC -->
<section id="experience" class="relative">
  <div id="filmStage" class="relative h-screen overflow-hidden bg-black">
    <div class="film-slide absolute inset-0"><img src="/morning-at-home-living-maldives.jpeg" class="w-full h-full object-cover object-center" alt="Morning at home balcony view"></div>
    <div class="film-slide absolute inset-0 opacity-0"><img src="/living-asia-entrance-visit.jpeg" class="w-full h-full object-cover object-[72%_center] md:object-center" alt="Living Asia entrance walkthrough"></div>
    <div class="film-slide absolute inset-0 opacity-0"><img src="/living-room-maldives.jpeg" class="w-full h-full object-cover object-center" alt="Living room lounge at midday"></div>
    <div class="film-slide absolute inset-0 opacity-0"><img src="/poolside-afternoon.png" class="w-full h-full object-cover object-[32%_center] md:object-center" alt="Poolside afternoon at home"></div>
    <div class="film-slide absolute inset-0 opacity-0"><img src="https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=2400&auto=format&fit=crop" class="w-full h-full object-cover" alt=""></div>
    <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(15,30,22,.75),rgba(0,0,0,.2) 50%,rgba(0,0,0,.35))"></div>
    <div class="absolute inset-0 flex flex-col justify-center" style="padding:0 clamp(20px,5vw,84px)">
      <span class="text-[#c49a4a] text-xs tracking-[0.3em] uppercase font-medium mb-4">One Day With Meka Asia</span>
      <div id="filmClock" class="pf text-white font-medium tracking-tight leading-none mb-3" style="font-size:clamp(3rem,10vw,8rem);text-shadow:0 2px 20px rgba(0,0,0,.5)">07:00</div>
      <div id="filmLabel" class="pf text-white/80 text-2xl italic">Morning at Home</div>
    </div>
    <div class="absolute bottom-10 left-0 w-full" style="padding:0 clamp(20px,5vw,84px)">
      <div class="h-px bg-white/20"><div id="filmProg" class="h-full bg-[#c49a4a] origin-left" style="transform:scaleX(0)"></div></div>
    </div>
  </div>
  <div class="hidden bg-[#173426]" style="padding:clamp(50px,10vw,80px) clamp(20px,5vw,40px)">
    <span class="text-[#c49a4a] text-xs tracking-[0.3em] uppercase font-medium mb-3 block">One Day With Meka Asia</span>
    <h2 class="pf text-[#fcf9f3] text-2xl font-medium tracking-tight mb-8">A Day in Your Future Home</h2>
    <div class="grid grid-cols-2 gap-3">
      <div class="relative rounded-lg overflow-hidden h-44"><img src="/morning-at-home-living-maldives.jpeg" class="w-full h-full object-cover object-center"><span class="absolute bottom-2 left-2 text-white text-xs">07:00 &middot; Morning</span></div>
      <div class="relative rounded-lg overflow-hidden h-44"><img src="/living-asia-entrance-visit.jpeg" class="w-full h-full object-cover object-center"><span class="absolute bottom-2 left-2 text-white text-xs">10:00 &middot; Entrance Walkthrough</span></div>
      <div class="relative rounded-lg overflow-hidden h-44"><img src="/living-room-maldives.jpeg" class="w-full h-full object-cover object-center"><span class="absolute bottom-2 left-2 text-white text-xs">12:00 &middot; Living Room</span></div>
      <div class="relative rounded-lg overflow-hidden h-44"><img src="https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover"><span class="absolute bottom-2 left-2 text-white text-xs">19:00 &middot; Secured</span></div>
    </div>
  </div>
</section>

<!-- NUMBERS -->
<section class="on-light bg-[#f6f1e7]" style="padding:clamp(60px,9vw,120px) clamp(20px,5vw,84px)">
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
    <div class="rv text-center md:text-left"><div class="pf text-[#204130] font-medium tracking-tight" style="font-size:clamp(2.5rem,5vw,4rem)"><span class="count" data-count="5">0</span></div><span class="text-[#1f1b13]/60 text-xs md:text-sm tracking-wide uppercase">Signature Projects</span></div>
    <div class="rv text-center md:text-left"><div class="pf text-[#204130] font-medium tracking-tight" style="font-size:clamp(2.5rem,5vw,4rem)"><span class="count" data-count="100">0</span>+</div><span class="text-[#1f1b13]/60 text-xs md:text-sm tracking-wide uppercase">Homes Planned</span></div>
    <div class="rv text-center md:text-left"><div class="pf text-[#204130] font-medium tracking-tight" style="font-size:clamp(2.5rem,5vw,4rem)"><span class="count" data-count="1">0</span></div><span class="text-[#1f1b13]/60 text-xs md:text-sm tracking-wide uppercase">Trusted Developer</span></div>
    <div class="rv text-center md:text-left"><div class="pf text-[#204130] font-medium tracking-tight" style="font-size:clamp(2.5rem,5vw,4rem)">24/7</div><span class="text-[#1f1b13]/60 text-xs md:text-sm tracking-wide uppercase">WhatsApp Consultation</span></div>
  </div>
</section>

<!-- AWARDS -->
<section class="on-light bg-[#fcf9f3]" style="padding:clamp(70px,10vw,140px) clamp(20px,5vw,84px)">
  <div class="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
    <div>
      <span class="rv text-[#c49a4a] text-xs tracking-[0.3em] uppercase font-medium mb-5 block">Recognition</span>
      <h2 class="wipe pf text-[#1f1b13] font-medium tracking-tight leading-[1.1] mb-7" style="font-size:clamp(1.7rem,3.5vw,2.8rem)">Recognized for Quality and Commitment</h2>
      <p class="rv text-[#1f1b13]/70 text-sm md:text-base font-light">Trust is earned through consistency, transparent process, and a commitment to creating lasting value for every buyer.</p>
    </div>
    <div class="rv grid grid-cols-2 gap-4">
      <div class="bg-[#f6f1e7] border border-[#e7ded0] rounded-lg p-8 flex flex-col items-center text-center"><iconify-icon icon="solar:cup-star-linear" width="36" class="text-[#c49a4a] mb-4"></iconify-icon><span class="text-[#1f1b13] text-sm font-medium">REI Recognition</span><span class="text-[#1f1b13]/50 text-xs">Real Estate Excellence</span></div>
      <div class="bg-[#f6f1e7] border border-[#e7ded0] rounded-lg p-8 flex flex-col items-center text-center"><iconify-icon icon="solar:medal-ribbon-linear" width="36" class="text-[#c49a4a] mb-4"></iconify-icon><span class="text-[#1f1b13] text-sm font-medium">Trusted Developer</span><span class="text-[#1f1b13]/50 text-xs">Lombok, Indonesia</span></div>
      <div class="bg-[#f6f1e7] border border-[#e7ded0] rounded-lg p-8 flex flex-col items-center text-center"><iconify-icon icon="solar:shield-check-linear" width="36" class="text-[#c49a4a] mb-4"></iconify-icon><span class="text-[#1f1b13] text-sm font-medium">Legal Clarity</span><span class="text-[#1f1b13]/50 text-xs">Transparent Ownership</span></div>
      <div class="bg-[#f6f1e7] border border-[#e7ded0] rounded-lg p-8 flex flex-col items-center text-center"><iconify-icon icon="solar:buildings-3-linear" width="36" class="text-[#c49a4a] mb-4"></iconify-icon><span class="text-[#1f1b13] text-sm font-medium">Quality Build</span><span class="text-[#1f1b13]/50 text-xs">Reliable Construction</span></div>
    </div>
  </div>
</section>

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
  <div class="absolute inset-0" style="z-index:0"><img src="/consultation-pool.jpg" class="w-full h-full object-cover object-center" alt="Private pool at Meka Asia residence"><div class="absolute inset-0" style="background:linear-gradient(to right,rgba(15,30,22,.9),rgba(15,30,22,.55))"></div></div>
  <canvas id="resGl" class="absolute inset-0 w-full h-full" style="z-index:1;mix-blend-mode:screen;opacity:.4"></canvas>
  <div class="relative grid lg:grid-cols-2 gap-12 items-center" style="z-index:3;padding:clamp(70px,10vw,140px) clamp(20px,5vw,84px)">
    <div>
      <span class="rv text-[#c49a4a] text-xs tracking-[0.3em] uppercase font-medium mb-5 block">Consultation</span>
      <h2 class="wipe pf text-[#fcf9f3] font-medium tracking-tight leading-[1.1] mb-7" style="font-size:clamp(2rem,4.5vw,3.4rem);text-shadow:0 2px 16px rgba(0,0,0,.4)">Start Your Property Journey in Lombok</h2>
      <p class="rv text-white/80 text-sm md:text-base font-light max-w-lg">Speak with the Meka Asia Property team and discover the right project for your lifestyle or investment goals.</p>
    </div>
    <div class="rv bg-white/5 backdrop-blur-sm border border-white/15 rounded-xl p-8 md:p-10">
      <form class="space-y-7">
        <div><label class="text-white/50 text-xs tracking-wide uppercase block mb-2">Name</label><input type="text" placeholder="Your full name" class="w-full bg-transparent text-white text-sm py-2 outline-none placeholder-white/30" style="border-bottom:1px solid rgba(255,255,255,.4)"></div>
        <div><label class="text-white/50 text-xs tracking-wide uppercase block mb-2">Phone / WhatsApp</label><input type="tel" placeholder="+62 ..." class="w-full bg-transparent text-white text-sm py-2 outline-none placeholder-white/30" style="border-bottom:1px solid rgba(255,255,255,.4)"></div>
        <div><label class="text-white/50 text-xs tracking-wide uppercase block mb-2">Preferred Project</label><input type="text" placeholder="Living Asia, Lavida, Green Asia..." class="w-full bg-transparent text-white text-sm py-2 outline-none placeholder-white/30" style="border-bottom:1px solid rgba(255,255,255,.4)"></div>
        <div><label class="text-white/50 text-xs tracking-wide uppercase block mb-2">Message</label><textarea rows="2" placeholder="Tell us about your goals" class="w-full bg-transparent text-white text-sm py-2 outline-none placeholder-white/30 resize-none" style="border-bottom:1px solid rgba(255,255,255,.4)"></textarea></div>
        <button type="button" class="btn w-full bg-[#c49a4a] text-[#173426] text-sm font-semibold tracking-wide py-4 rounded-full flex items-center justify-center gap-2 hover:bg-white">Consult via WhatsApp <span class="arw">&rarr;</span></button>
      </form>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="bg-[#173426] px-5 py-12 text-[#e0c783] sm:px-8">
  <div class="mx-auto max-w-7xl">
    <div class="grid gap-10 border-b border-[#e0c783]/20 pb-10 md:grid-cols-[1.35fr_0.9fr_1.25fr]">
      <div>
        <img src="/brand/meka-asia-logo-footer-white.png" width="220" height="44" class="h-11 w-auto object-contain mb-6" alt="Meka Asia Property">
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
        <a href="#" class="transition hover:text-[#e0c783]">Kebijakan Privasi</a>
        <a href="#" class="transition hover:text-[#e0c783]">Syarat &amp; Ketentuan</a>
      </div>
      <p>Copyright 2026 Meka Asia Property</p>
    </div>
  </div>
</footer>
`;

export default function Home() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis;
    let active = true;

    gsap.registerPlugin(ScrollTrigger);
    gsap.set(".ln>span", { yPercent: 115 });

    gsap.to(".ln>span", {
      yPercent: 0,
      duration: 1.1,
      stagger: 0.08,
      ease: "power4.out",
      delay: 0.15,
    });

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09 });
      const raf = (time) => {
        if (!active) return;
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
      lenis.on("scroll", ScrollTrigger.update);
    }

    const nav = document.getElementById("nav");
    document.querySelectorAll(".on-light").forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top 70px",
        end: "bottom 70px",
        onToggle: (self) => nav?.classList.toggle("on-light", self.isActive),
      });
    });

    gsap.to("#heroMedia", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.fromTo(
      "#bleedImg",
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: "#villa",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      "#whyMekaImg",
      { yPercent: -7, scale: 1.16 },
      {
        yPercent: 7,
        scale: 1.16,
        ease: "none",
        scrollTrigger: {
          trigger: "#why-meka",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    gsap.utils.toArray(".rv").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    gsap.utils.toArray(".wipe").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        clipPath: "inset(0 0 -5% 0)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    gsap.utils.toArray(".rule").forEach((el) => {
      gsap.to(el, {
        scaleY: 1,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });

    gsap.utils.toArray(".count").forEach((el) => {
      const end = Number(el.dataset.count);
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(
            { v: 0 },
            {
              v: end,
              duration: 1.6,
              ease: "power2.out",
              onUpdate() {
                el.textContent = Math.round(this.targets()[0].v);
              },
            }
          );
        },
      });
    });

    document.querySelectorAll(".faq-head").forEach((head) => {
      head.addEventListener("click", () => {
        const item = head.parentElement;
        document.querySelectorAll(".faq-item").forEach((faqItem) => {
          if (faqItem !== item) faqItem.classList.remove("open");
        });
        item?.classList.toggle("open");
      });
    });

    const slides = gsap.utils.toArray(".film-slide");
    const clock = document.getElementById("filmClock");
    const label = document.getElementById("filmLabel");
    const progress = document.getElementById("filmProg");
    const times = ["07:00", "10:00", "12:00", "16:00", "19:00"];
    const labels = [
      "Morning at Home",
      "Entrance Walkthrough",
      "Living Room",
      "Poolside Afternoon",
      "Future Secured",
    ];
    const total = slides.length;
    const isMobile = window.innerWidth < 768;

    ScrollTrigger.create({
      trigger: "#filmStage",
      start: "top top",
      end: isMobile ? "+=1600" : "+=2500",
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const segment = self.progress * (total - 1);
        slides.forEach((slide, index) => {
          slide.style.opacity = Math.max(0, 1 - Math.abs(segment - index));
        });
        const index = Math.min(total - 1, Math.round(segment));
        if (clock) clock.textContent = times[index];
        if (label) label.textContent = labels[index];
        if (progress) progress.style.transform = `scaleX(${self.progress})`;
      },
    });

    const initGl = (canvas) => {
      const gl = canvas?.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: false,
      });
      if (!gl || !canvas) return;

      const resize = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      };

      const vertexSource = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
      const fragmentSource = `precision highp float;uniform float t;uniform vec2 r;
      void main(){
        vec2 uv=gl_FragCoord.xy/r.xy;
        vec2 q=uv*6.0;
        float c=0.0;
        for(int i=0;i<5;i++){
          float fi=float(i);
          c+=sin(t*0.5+q.y+fi*1.3)*0.5+0.5;
          q+=vec2(sin(q.y*0.6+t*0.3),cos(q.x*0.6+t*0.2))*0.4;
        }
        c=pow(c/5.0,3.0);
        vec3 col=mix(vec3(0.12,0.25,0.18),vec3(0.77,0.60,0.29),c);
        gl_FragColor=vec4(col*c,c*0.6);
      }`;

      const createShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
      };

      const program = gl.createProgram();
      gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );

      const location = gl.getAttribLocation(program, "p");
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);

      const timeUniform = gl.getUniformLocation(program, "t");
      const resolutionUniform = gl.getUniformLocation(program, "r");
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      resize();
      window.addEventListener("resize", resize);

      const render = (time) => {
        if (!active) return;
        gl.uniform1f(timeUniform, time * 0.001);
        gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    };

    if (!reduced) {
      initGl(document.getElementById("heroGl"));
      initGl(document.getElementById("resGl"));
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        if (lenis) {
          lenis.scrollTo(target);
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    return () => {
      active = false;
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf("*");
    };
  }, []);

  return (
    <>
      <Script
        src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"
        strategy="afterInteractive"
      />
      <div dangerouslySetInnerHTML={{ __html: pageMarkup }} />
    </>
  );
}
