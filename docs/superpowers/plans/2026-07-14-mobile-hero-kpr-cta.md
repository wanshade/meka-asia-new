# Mobile Hero KPR CTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display the existing `Simulasi KPR` hero CTA on mobile while preserving its desktop styling, destination, and secondary hierarchy.

**Architecture:** Keep the existing anchor and hero flex container. Remove only the responsive utility that hides the CTA below the `md` breakpoint; the existing `flex-wrap` container will handle narrow widths without new CSS or JavaScript.

**Tech Stack:** Next.js 16, JSX-generated page markup, Tailwind utility classes, PowerShell verification, npm production build.

## Global Constraints

- The CTA label remains exactly `Simulasi KPR`.
- The CTA destination remains exactly `/simulasi-kpr`.
- The WhatsApp CTA remains first and visually primary.
- Desktop styling and behavior remain unchanged.
- No new CSS, JavaScript state, dependencies, routes, or error states.
- Push directly to `origin/main` without creating a pull request.

---

### Task 1: Make the hero KPR CTA responsive

**Files:**
- Modify: `app/HomeClient.jsx:127`
- Create: `docs/superpowers/plans/2026-07-14-mobile-hero-kpr-cta.md`
- Test: inline PowerShell source assertion and `npm run build`

**Interfaces:**
- Consumes: existing `/simulasi-kpr` route and hero `flex flex-wrap gap-4` CTA container.
- Produces: one hero anchor visible at all breakpoints with `display: flex` alignment.

- [ ] **Step 1: Run the failing mobile-visibility assertion**

```powershell
$source = Get-Content -Raw -LiteralPath 'app/HomeClient.jsx'
$pattern = 'href="/simulasi-kpr" class="btn border border-white/50[^\r\n]*hidden md:flex"'
if ($source -match $pattern) {
  Write-Error 'FAIL expected: hero Simulasi KPR still contains hidden md:flex'
  exit 1
}
'PASS: hero Simulasi KPR is visible on mobile'
```

Expected: FAIL because the current hero CTA contains `hidden md:flex`.

- [ ] **Step 2: Implement the minimal class change**

In `app/HomeClient.jsx`, change only the hero KPR anchor from:

```jsx
<a href="/simulasi-kpr" class="btn border border-white/50 text-white text-xs md:text-sm font-medium tracking-wide px-7 py-4 rounded-full items-center gap-2.5 hover:bg-white/10 hidden md:flex">
```

to:

```jsx
<a href="/simulasi-kpr" class="btn border border-white/50 text-white text-xs md:text-sm font-medium tracking-wide px-7 py-4 rounded-full flex items-center gap-2.5 hover:bg-white/10">
```

- [ ] **Step 3: Run the source assertion again**

Run the PowerShell assertion from Step 1.

Expected: PASS with `hero Simulasi KPR is visible on mobile`.

- [ ] **Step 4: Verify destination, hierarchy, and production compilation**

```powershell
$source = Get-Content -Raw -LiteralPath 'app/HomeClient.jsx'
if (-not $source.Contains('href="/simulasi-kpr"')) { throw 'KPR route missing' }
if (-not $source.Contains('Consult via WhatsApp')) { throw 'Primary WhatsApp CTA missing' }
git diff --check
npm run build
```

Expected: both CTA assertions pass, `git diff --check` exits `0`, and Next.js reports `Compiled successfully`.

- [ ] **Step 5: Commit the implementation and plan**

```powershell
git add -- app/HomeClient.jsx docs/superpowers/plans/2026-07-14-mobile-hero-kpr-cta.md
git commit -m "Show KPR CTA on mobile hero"
```

Expected: one implementation commit containing the JSX change and this plan.

- [ ] **Step 6: Push directly and verify synchronization**

```powershell
git push origin main
git fetch origin main
if ((git rev-parse HEAD) -ne (git rev-parse origin/main)) { throw 'origin/main is not synchronized' }
git status -sb
```

Expected: `main -> main`, identical local and remote commit hashes, and no pull request creation.

