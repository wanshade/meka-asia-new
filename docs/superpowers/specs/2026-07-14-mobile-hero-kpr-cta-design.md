# Mobile Hero KPR CTA Design

## Goal

Show the existing `Simulasi KPR` hero CTA on mobile so visitors can open `/simulasi-kpr` directly from the first screen.

## Approved Approach

Use the existing outlined desktop CTA without changing its label, destination, colors, typography, spacing, or hierarchy. Remove only the mobile-hiding utility so the button participates in the hero's existing wrapping flex layout at every viewport width.

The WhatsApp CTA remains first and visually primary. On narrow screens, the existing `flex-wrap` behavior may place `Simulasi KPR` beside or below it depending on available width. Desktop behavior remains unchanged.

## Scope

- Update the hero CTA classes in `app/HomeClient.jsx`.
- Preserve the existing `/simulasi-kpr` route and arrow treatment.
- Do not change the navbar, hero copy, background media, or other KPR links.
- Push the completed change directly to `origin/main` without creating a pull request.

## Interaction and Failure Behavior

The CTA is a normal internal link, so it requires no new state or JavaScript. If routing succeeds, it opens the existing KPR simulator. No new error state is required because the destination route already exists.

## Verification

- Confirm the CTA no longer contains a mobile-hiding utility.
- Confirm it still uses flex alignment and points to `/simulasi-kpr`.
- Confirm the production build succeeds.
- Confirm only the intended source and design documentation are committed.

