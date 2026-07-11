"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  campaigns,
  promoConfig,
  trackPromoEvent,
} from "../../lib/promoCampaigns";

const AUTO_SLIDE_MS = 4000;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isTypingTarget(el) {
  if (!el || !(el instanceof Element)) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return el.isContentEditable;
}

function decodeImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = async () => {
      try {
        if (img.decode) await img.decode();
      } catch {
        // decode optional
      }
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

export default function PromoPopup() {
  const labelId = useId();
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const overlayRef = useRef(null);
  const previouslyFocused = useRef(null);
  const closedThisView = useRef(false);
  const impressionSent = useRef(false);

  const [activeIndex, setActiveIndex] = useState(
    promoConfig.initialCampaignIndex ?? 0
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [failedIds, setFailedIds] = useState(() => new Set());

  const usableCampaigns = campaigns.filter((c) => !failedIds.has(c.id));
  const campaign =
    usableCampaigns[
      Math.min(activeIndex, Math.max(usableCampaigns.length - 1, 0))
    ] || null;
  const total = usableCampaigns.length;

  const close = useCallback(() => {
    if (!isOpen) return;
    closedThisView.current = true;
    trackPromoEvent("promo_close", { campaignId: campaign?.id });

    const reduced = prefersReducedMotion();
    if (reduced) {
      setIsOpen(false);
      setIsVisible(false);
    } else {
      setIsVisible(false);
      window.setTimeout(() => setIsOpen(false), 200);
    }
  }, [campaign?.id, isOpen]);

  // Prefetch poster, then open when user scrolls to trigger section
  useEffect(() => {
    if (!promoConfig.demoMode) return;
    if (!campaigns.length) return;

    let cancelled = false;
    let opened = false;
    let posterReady = false;
    let io = null;
    let pollId = null;
    let findTimer = null;
    let typingRetry = null;

    const cleanupWatchers = () => {
      io?.disconnect();
      io = null;
      if (pollId != null) {
        clearInterval(pollId);
        pollId = null;
      }
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      document.removeEventListener("scroll", onScrollOrResize, true);
    };

    const openPopup = () => {
      if (cancelled || closedThisView.current || opened) return;
      if (!posterReady) return;
      if (document.hidden) return;
      if (isTypingTarget(document.activeElement)) {
        typingRetry = window.setTimeout(openPopup, 600);
        return;
      }

      opened = true;
      cleanupWatchers();
      previouslyFocused.current = document.activeElement;
      setImageReady(true);
      setIsOpen(true);
      requestAnimationFrame(() => {
        if (!cancelled && !closedThisView.current) {
          setIsVisible(true);
        }
      });
    };

    const isTriggerInView = () => {
      const selector = promoConfig.triggerSelector || "#why-meka";
      const el = document.querySelector(selector);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      return rect.top < vh * 0.85 && rect.bottom > 48;
    };

    function onScrollOrResize() {
      if (isTriggerInView()) openPopup();
    }

    const attachWatchers = (target) => {
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) openPopup();
          },
          { root: null, threshold: [0, 0.05, 0.1], rootMargin: "0px" }
        );
        io.observe(target);
      }

      window.addEventListener("scroll", onScrollOrResize, true);
      document.addEventListener("scroll", onScrollOrResize, true);
      window.addEventListener("resize", onScrollOrResize);
      pollId = window.setInterval(onScrollOrResize, 350);
      onScrollOrResize();
    };

    const findAndWatch = (attempt = 0) => {
      if (cancelled) return;
      const selector = promoConfig.triggerSelector || "#why-meka";
      const target = document.querySelector(selector);
      if (target) {
        attachWatchers(target);
        return;
      }
      if (attempt < 40) {
        findTimer = window.setTimeout(() => findAndWatch(attempt + 1), 200);
      }
    };

    const bootPoster = async () => {
      const first =
        campaigns[promoConfig.initialCampaignIndex ?? 0] || campaigns[0];
      try {
        await decodeImage(first.image);
        if (cancelled) return;
        posterReady = true;
        setImageReady(true);
      } catch {
        const alt = campaigns.find((c) => c.id !== first.id);
        if (!alt) return;
        try {
          await decodeImage(alt.image);
          if (cancelled) return;
          setFailedIds((prev) => new Set(prev).add(first.id));
          setActiveIndex(campaigns.findIndex((c) => c.id === alt.id));
          posterReady = true;
          setImageReady(true);
        } catch {
          return;
        }
      }
      if (isTriggerInView()) openPopup();
    };

    const onVisible = () => {
      if (!document.hidden && isTriggerInView()) openPopup();
    };
    document.addEventListener("visibilitychange", onVisible);

    void bootPoster();
    findTimer = window.setTimeout(() => findAndWatch(0), 50);

    return () => {
      cancelled = true;
      if (findTimer) clearTimeout(findTimer);
      if (typingRetry) clearTimeout(typingRetry);
      cleanupWatchers();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // Prefetch remaining posters after open
  useEffect(() => {
    if (!isOpen || !campaign) return;
    const others = campaigns.filter((c) => c.id !== campaign.id);
    others.forEach((c) => {
      decodeImage(c.image).catch(() => {
        setFailedIds((prev) => new Set(prev).add(c.id));
      });
    });
  }, [isOpen, campaign]);

  // Auto-slide between posters
  useEffect(() => {
    if (!isOpen || !isVisible || total < 2) return;
    if (prefersReducedMotion()) return;

    let id = null;

    const start = () => {
      if (id != null || document.hidden) return;
      id = window.setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % total);
      }, AUTO_SLIDE_MS);
    };

    const stop = () => {
      if (id == null) return;
      clearInterval(id);
      id = null;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isOpen, isVisible, total]);

  // Impression tracking
  useEffect(() => {
    if (!isOpen || !isVisible || !campaign || impressionSent.current) return;
    impressionSent.current = true;
    trackPromoEvent("promo_impression", { campaignId: campaign.id });
  }, [isOpen, isVisible, campaign]);

  // Scroll lock + focus + keyboard
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const { body, documentElement } = document;
    const prevOverflow = body.style.overflow;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevPad = body.style.paddingRight;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    documentElement.classList.add("promo-modal-open");
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const focusTimer = window.setTimeout(() => {
      closeRef.current?.focus({ preventScroll: true });
    }, 40);

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = prevOverflow;
      documentElement.style.overflow = prevHtmlOverflow;
      documentElement.classList.remove("promo-modal-open");
      body.style.paddingRight = prevPad;
      window.scrollTo(0, scrollY);
      const prev = previouslyFocused.current;
      if (prev && typeof prev.focus === "function") {
        try {
          prev.focus({ preventScroll: true });
        } catch {
          // ignore
        }
      }
    };
  }, [isOpen, close]);

  const onBackdropClick = (e) => {
    if (e.target === overlayRef.current) close();
  };

  if (!isOpen || !campaign || !imageReady) return null;

  return (
    <div
      ref={overlayRef}
      className={`promo-overlay${isVisible ? " is-visible" : ""}`}
      onClick={onBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={`promo-dialog${isVisible ? " is-visible" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={labelId} className="promo-sr-only">
          Promo Meka Asia
        </h2>

        <button
          ref={closeRef}
          type="button"
          className="promo-close"
          aria-label="Tutup promo"
          onClick={close}
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="promo-poster-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={campaign.id}
            src={campaign.image}
            alt={campaign.imageAlt}
            width={720}
            height={1280}
            decoding="async"
            className="promo-poster"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
