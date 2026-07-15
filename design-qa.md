# Design QA — One Day With Meka Asia Mobile Carousel

- Source visual truth: selected “Editorial Full-Bleed” concept generated during the design phase.
- Implementation screenshot: `.next/design-qa/one-day-mobile-implementation-390x844.png`
- Full-view comparison: `.next/design-qa/one-day-mobile-comparison.png`
- Focused comparison: `.next/design-qa/one-day-mobile-focused-comparison.png`
- Viewport: 390 × 844
- State: mobile, first scene active, navigation hidden, promo dismissed, swipe hint visible

**Findings**

- No actionable P0, P1, or P2 findings remain.
- Fonts and typography: Playfair Display and Inter preserve the mock's editorial serif/sans hierarchy. The numeral shapes differ slightly from the generated concept's Didone face, but the final scale, weight, line height, and hierarchy are equivalent and remain legible.
- Spacing and layout rhythm: the active slide measures 347.45 px with a 42.55 px next-slide preview, matching the selected 89/11 composition. The section and slide are 844 px high. The swipe hint measures 183.49 × 42 px, and its 62.35 px separation from the copy prevents overlap.
- Colors and visual tokens: deep green, warm ivory, and gold map to the existing Meka Asia palette. The bottom treatment preserves text contrast without introducing a separate card surface.
- Image quality and asset fidelity: all five approved responsive AVIF/WebP assets are retained. The first photo is cropped closer than the generated concept because the production asset is landscape; this is an intentional authenticity constraint instead of generating replacement architecture or people. High-density iPhones select the larger responsive sources.
- Copy and content: the five times and scene labels are distinct and correct. The visible instruction is `Geser`, while an ARIA live region announces the active time, label, and position.
- Icons: the swipe affordance uses the existing Iconify Solar arrow rather than a text glyph, custom SVG, or CSS-drawn icon.
- States and interactions: native horizontal scrolling moved the active state from scene 1 to scene 2, hid the instructional hint, and updated the live status from `07:00` to `10:00`. Arrow-key navigation moved from scene 2 to scene 3. The fifth scene now reaches the left snap edge with full copy and overlay opacity.
- Accessibility: the region is keyboard-focusable, every image retains alt text, each scene has a group label, the active scene exposes `aria-current`, reduced motion disables decorative movement, and the hint does not intercept touch input. The immersive navbar state also applies `inert` and `aria-hidden`, then restores both after the section.
- Viewport resilience: 375 × 667 testing kept a 42 px copy-to-hint gap, full-height imagery, readable text, and the intended next-slide preview.

**Open Questions**

- None blocking. Portrait-specific source photography could reduce cropping further if the client supplies approved vertical exports later.

**Implementation Checklist**

- [x] Replace the small rounded mobile cards with a full-height editorial rail.
- [x] Preserve a visible next-slide edge as the primary swipe affordance.
- [x] Add a lightweight animated `Geser` hint that disappears after interaction.
- [x] Update active time and label on real horizontal scrolling.
- [x] Keep desktop cinematic behavior unchanged.
- [x] Validate 390 × 844 and 375 × 667 mobile viewports.
- [x] Validate keyboard navigation, live status, reduced motion styling, and production build.

**Patches Made Since The Previous QA Pass**

- Increased the time scale and raised the copy block to match the selected mock.
- Matched the 183 × 42 px swipe hint and replaced the short arrow with a stretched Solar icon treatment.
- Increased title contrast on bright scenes while preserving the gold brand accent.
- Simplified the mobile scroll driver to native snap plus lightweight active-state updates.
- Limited image transforms to the active slide and its immediate neighbors.
- Added dynamic viewport height support for collapsing iPhone Safari chrome.
- Added trailing snap space so the fifth scene reaches a true full-opacity active state.
- Preserved the swipe carousel on coarse-pointer phone landscape orientations.
- Removed the hidden navbar from focus and the accessibility tree while the story is immersive.
- Restored eager, high-priority loading for the first cinematic frame.

**Follow-up Polish**

- P3: replace landscape photos with approved portrait art-directed exports if they become available; no code change is required for that asset swap.

final result: passed
