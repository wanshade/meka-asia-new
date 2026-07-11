/** Promo campaign data for homepage popup (demo mode). */

export const promoConfig = {
  demoMode: true,
  initialCampaignIndex: 0,
  /** Open popup when this section enters the viewport (scroll trigger). */
  triggerSelector: "#projects",
};

export const campaigns = [
  {
    id: "green-tamarin-july-2026",
    project: "Green Tamarin",
    image: "/iklan/iklan1.jpeg",
    imageAlt:
      "Promo Green Tamarin cashback tujuh juta rupiah khusus bulan Juli",
  },
  {
    id: "living-asia-july-2026",
    project: "Living Asia",
    image: "/iklan/iklan2.jpeg",
    imageAlt: "Promo Living Asia July Deal cashback seratus juta rupiah",
  },
];

/** Optional analytics hook — no-op by default, swap later for a real tracker. */
export function trackPromoEvent(eventName, payload = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(
      new CustomEvent("meka:promo", {
        detail: { event: eventName, ...payload },
      })
    );
  } catch {
    // ignore
  }
}
