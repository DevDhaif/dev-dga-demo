# Masar (مسار) | `@dev-dga` showcase console

A **government service-operations console** demo built as a true external consumer of the
[`@dev-dga`](https://www.npmjs.com/package/@dev-dga/react) design system (installed from npm,
not workspace-linked). Fictional municipal-services agency: citizen request queue with status
workflows and per-request detail/comments, a multi-step intake form (incl. OTP verification),
appointment scheduling, staff directory, document center, public service catalog, reports with
live charts, an audit log, and a help center 17 views total.

**Live demo:** https://dev-dga-demo.vercel.app — toggle the language / light-dark / brand color from the topbar.

> **Sign in with `admin` / `password`** (static demo auth no backend anywhere).

**Every one of the design system's component families is used in real composition**
(196 of 204 PascalCase exports) , enforced by `src/lib/coverage.test.ts`.

## Highlights

- **Bilingual AR/EN** with a dedicated typed i18n layer (`src/i18n/` , flat dot-keys,
  compile-time + test-time catalog parity, zero inline copy in views).
- **Live RTL/LTR + light/dark + brand color** , all persisted, no flash-of-wrong-theme
  (pre-paint script). The Settings -> Appearance **brand picker** re-themes the whole app
  through `DgaProvider theme` at runtime.
- **Fully themeable** , brand color via `DgaProvider theme`, everything else via CSS tokens.
  See **[THEMING.md](./THEMING.md)** for the complete, verified guide; copy
  **[`examples/brand.css`](./examples/brand.css)** to re-skin the library with your own brand.
- **Real interactions, no backend:** a session store (pure reducers over JSON fixtures) ,
  submit a request and it appears in the queue, the Overview KPIs, the sidebar badge, the
  notifications drawer and the audit log; approve/assign/comment from the request detail page
  and every other view updates.
- **⌘K palette searches real data** , requests by ID or applicant name (Arabic or English),
  staff, services, documents , plus page navigation and theme/language actions.
- **Token-colored charts with no chart dependency** , KPI sparkline, 30-day intake area chart,
  appointments bar chart: small inline SVG/div components driven by design tokens.
- **Tailwind v4 with preflight disabled** , utilities for layout only, the design system owns
  the component surface (the real-world adoption scenario).
- **Tested:** Vitest + Testing Library + vitest-axe; every view smoke + a11y checked in both
  `ltr` and `rtl`; pure logic TDD'd against fixture-pinned invariants. 190+ tests.

## Stack

Vite · React 19 · TypeScript (strict) · React Router v7 (data mode) ·
`@dev-dga/{react,css,tokens}` ^0.10.0 · Tailwind v4 · lucide-react

## Commands

```bash
npm install
npm run dev      # http://localhost:5173 , sign in: admin / password
npm test         # 190+ tests incl. axe (ltr+rtl) + component-family coverage gate
npm run build    # tsc -b + vite build
```

## Notes

- This demo doubles as the design system's **dogfooding consumer** , several `@dev-dga`
  releases (0.9.x sidebar fixes, 0.10.0 ScrollArea/StatGroup/`paginationRange`) shipped fixes
  first surfaced here.
- Fixtures are pinned around a demo "today" (2026-06-10) so KPIs and schedules read
  truthfully. Session mutations reset on reload by design; only UI prefs and the demo
  sign-in persist in `localStorage`.
- Deploys as a static SPA (`vercel.json` rewrite included).
- All names, people and services are fictional. No real data should ever be entered.
