# Theming & tokens , controlling the look of `@dev-dga`

Complete reference for everything a developer can customize in `@dev-dga` (v0.8.3). Components read
CSS variables (`--ddga-*`); you change the look by overriding those variables. Names and values below
are extracted from the installed packages , re-verify after an upgrade by grepping
`node_modules/@dev-dga/css/dist/`.

## The model

| Layer                  | What                                      | Where it's defined            | How you override                                                               |
| ---------------------- | ----------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------ |
| **Brand color**        | `--ddga-color-primary` + states           | `:root` (or the `theme` prop) | `<DgaProvider theme={{ primary }} />`, `.ddga-theme-*` class, or set the var   |
| **Global tokens**      | colors, spacing, radius, shadow, fonts    | `:root`                       | Set `--ddga-*` at `:root`, on a container, or inline                           |
| **Per-component vars** | sidebar width, card padding, avatar size… | the component's **own class** | Set on that class or inline , **not** `:root` (a `:root` override is shadowed) |

```ts
import '@dev-dga/css'; // defaults
import './brand.css'; // your overrides , unlayered :root beats @dev-dga's @layer, so it wins
```

```css
/* brand.css */
:root {
  --ddga-color-primary: #7c3aed;
  --ddga-space-2: 0.4rem;
  --ddga-radius-md: 0.375rem;
  --ddga-font-en: 'Inter', sans-serif;
}
[data-theme='dark'] {
  --ddga-color-card: #18151f;
}
```

A copy-paste starter covering all three layers is in [`examples/brand.css`](./examples/brand.css).

---

## 1. Brand color , the `theme` prop

`<DgaProvider theme={{ primary }} />`. `primary` accepts three forms (source: `@dev-dga/tokens` ->
`applyPrimary`). Each sets exactly five vars: `--ddga-color-primary`, `-hover`, `-active`,
`-foreground`, `--ddga-color-ring`.

```tsx
<DgaProvider theme={{ primary: 'lavender' }}>                      {/* a palette name */}
<DgaProvider theme={{ primary: '#7C3AED' }}>                       {/* any CSS color; hover/active via color-mix */}
<DgaProvider theme={{ primary: { base: '#7C3AED', hover: '#6D28D9', active: '#5B21B6', foreground: '#FFFFFF' } }}>
```

Palette names: `saGreen` `gray` `error` `warning` `success` `info` `gold` `lavender`.
Inspect the output: `buildTheme({ primary: 'gold' })` -> the five-var map.

**Class form (no prop):** apply `.ddga-theme-{name}` (kebab , `.ddga-theme-sa-green`, `.ddga-theme-gold`…)
to any element to re-theme its subtree.

A set `theme`/class pins primary across **both** light and dark (it shadows the built-in dark-mode
adjustment). For a mode-aware primary, leave the default or set the var per `[data-theme]`.

---

## 2. Global tokens , full reference

Every token is a `--ddga-*` property on `:root`. Override at `:root`, on a wrapper, or inline
(`style={{ '--ddga-…': value } as React.CSSProperties}` , inline wins). The **Dark** column marks
tokens that `[data-theme="dark"]` re-points (override those under `[data-theme='dark']` too).

### Semantic colors

| Token                                                 | Light                             | Dark-aware |
| ----------------------------------------------------- | --------------------------------- | :--------: |
| `--ddga-color-primary` / `-hover` / `-active`         | `#25935F` / `#1B8354` / `#166A45` |     ✅     |
| `--ddga-color-primary-foreground`                     | `#FFFFFF`                         |     ✅     |
| `--ddga-color-ring`                                   | `#25935F`                         |     ✅     |
| `--ddga-color-secondary` / `-hover` / `-foreground`   | `#F3F4F6` / `#E5E7EB` / `#0D121C` |     ✅     |
| `--ddga-color-background`                             | `#FFFFFF`                         |     ✅     |
| `--ddga-color-foreground`                             | `#0D121C`                         |     ✅     |
| `--ddga-color-card` / `-foreground`                   | `#FFFFFF` / `#0D121C`             |     ✅     |
| `--ddga-color-muted` / `-foreground`                  | `#F3F4F6` / `#6C737F`             |     ✅     |
| `--ddga-color-border`                                 | `#E5E7EB`                         |     ✅     |
| `--ddga-color-input`                                  | `#D2D6DB`                         |     ✅     |
| `--ddga-color-destructive` / `-hover` / `-foreground` | `#D92D20` / `#B42318` / `#FFFFFF` |     ✅     |
| `--ddga-color-error` / `-hover` / `-foreground`       | `#D92D20` / `#B42318` / `#FFFFFF` |     ✅     |
| `--ddga-color-success` / `-hover` / `-foreground`     | `#079455` / `#067647` / `#FFFFFF` |     ✅     |
| `--ddga-color-warning` / `-hover` / `-foreground`     | `#DC6803` / `#B54708` / `#FFFFFF` |     ✅     |
| `--ddga-color-info` / `-hover` / `-foreground`        | `#1570EF` / `#175CD3` / `#FFFFFF` |     ✅     |

### Text

| Token                     | Light     | Dark-aware |
| ------------------------- | --------- | :--------: |
| `--ddga-text-primary`     | `#0D121C` |     ✅     |
| `--ddga-text-secondary`   | `#4D5761` |     ✅     |
| `--ddga-text-tertiary`    | `#6C737F` |     ✅     |
| `--ddga-text-placeholder` | `#9DA4AE` |     ✅     |

### Spacing (`--ddga-space-*`, NOT `-spacing-*`) , read for all gaps/padding

| `0` | `1`      | `2`     | `3`      | `4`    | `5`       | `6`      | `8`    | `10`     | `12`   | `16`   |
| --- | -------- | ------- | -------- | ------ | --------- | -------- | ------ | -------- | ------ | ------ |
| `0` | `.25rem` | `.5rem` | `.75rem` | `1rem` | `1.25rem` | `1.5rem` | `2rem` | `2.5rem` | `3rem` | `4rem` |

### Radius

| `none` | `sm`     | `md`    | `lg`     | `xl`   | `full`   |
| ------ | -------- | ------- | -------- | ------ | -------- |
| `0`    | `.25rem` | `.5rem` | `.75rem` | `1rem` | `9999px` |

### Shadow

`--ddga-shadow-sm` `0 1px 2px 0 #0000000d` · `-md` `0 4px 6px -1px #0000001a` ·
`-lg` `0 10px 15px -3px #0000001a` · `-none` `none` _(sm/md/lg darken under dark mode)_

### Typography

- Families: `--ddga-font-en` · `--ddga-font-ar` · `--ddga-font-mono`
- Weights: `--ddga-font-weight-regular|medium|semibold|bold` -> `400 / 500 / 600 / 700`
- Sizes: `--ddga-font-size-xs|sm|base|lg|xl|2xl|3xl` -> `.75 / .875 / 1 / 1.125 / 1.25 / 1.5 / 2 rem`

### Palette scales , `--ddga-{prefix}-{step}`, steps `25 50 100 200 300 400 500 600 700 800 900 950`

The brand palettes the semantic colors reference. Prefixes: `sa` (saGreen), `gray`, `error`,
`warning`, `success`, `info`, `gold`, `lavender`. The `500` of each:

| Palette              | 500       | Palette               | 500       |
| -------------------- | --------- | --------------------- | --------- |
| `--ddga-sa-500`      | `#25935F` | `--ddga-info-500`     | `#2E90FA` |
| `--ddga-gray-500`    | `#6C737F` | `--ddga-gold-500`     | `#F5BD02` |
| `--ddga-error-500`   | `#F04438` | `--ddga-lavender-500` | `#80519F` |
| `--ddga-warning-500` | `#F79009` | `--ddga-success-500`  | `#17B26A` |

Scales are **not** dark-aware (constant across modes). Full 12-step hex per palette:
`grep '\-\-ddga-sa-' node_modules/@dev-dga/css/dist/index.css`.

---

## 3. Per-component vars

Each component declares its own vars on **its own class**, not `:root`. So override them by
redefining that class (`.ddga-sidebar-wrapper { --ddga-sidebar-width: 20rem }`) or inline on the
instance , a `:root` override is silently shadowed.

### Fixed defaults (one value , override via class or inline)

| Variable                                    | Component (class)                          | Default                                             |
| ------------------------------------------- | ------------------------------------------ | --------------------------------------------------- |
| `--ddga-sidebar-width`                      | Sidebar (`.ddga-sidebar-wrapper`)          | `16rem`                                             |
| `--ddga-sidebar-width-icon`                 | Sidebar collapsed rail                     | `3.5rem`                                            |
| `--ddga-tabs-indicator-thickness`           | Tabs (`.ddga-tabs`)                        | `2px`                                               |
| `--ddga-divider-color`                      | Divider (`.ddga-divider`)                  | `var(--ddga-color-border)`                          |
| `--ddga-dl-term-width`                      | DescriptionList (`.ddga-description-list`) | `12rem`                                             |
| `--ddga-quote-accent`                       | Quote (`.ddga-quote`)                      | `var(--ddga-color-primary)`                         |
| `--ddga-scroll-area-size`                   | ScrollArea (`.ddga-scroll-area`)           | `.625rem`                                           |
| `--ddga-scroll-area-thumb` / `-thumb-hover` | ScrollArea thumb                           | `var(--ddga-gray-400)` / `-500`                     |
| `--ddga-rating-color` / `-empty`            | Rating                                     | `var(--ddga-gold-500)` / `var(--ddga-color-border)` |

### Set by `size`/`variant`/density prop (prefer the prop; inline for one-offs)

| Variable                                                         | Component  | Values                                                    |
| ---------------------------------------------------------------- | ---------- | --------------------------------------------------------- |
| `--ddga-avatar-size`                                             | Avatar     | `24 / 32 / 40 / 48 / 64px`                                |
| `--ddga-card-padding`                                            | Card       | `space-3 / 5 / 6`                                         |
| `--ddga-table-pad-block` / `-inline`                             | Table      | `space-2..4` / `space-3..5`                               |
| `--ddga-stat-group-gap`                                          | StatGroup  | `space-3 / 4 / 6`                                         |
| `--ddga-slider-rail` / `-thumb`                                  | Slider     | `4–6px` / `14–18px`                                       |
| `--ddga-switch-thumb-travel`                                     | Switch     | `12 / 16px`                                               |
| `--ddga-timeline-node-size` / `-dot-size` / `-gap` / `-rail-gap` | Timeline   | `1.25–1.5rem` / `.625–.75rem` / `space-4–5` / `space-2–3` |
| `--ddga-empty-state-icon-size` / `-media-size`                   | EmptyState | `1.375–2.25rem` / `2.75–4.5rem`                           |

### Status tints (follow the matching semantic/palette token)

`--ddga-alert-bg` / `-fg` / `-accent`, `--ddga-stat-accent-bg` / `-fg` / `--ddga-stat-change-color`,
`--ddga-progress-color`, `--ddga-timeline-node-color`, `--ddga-toast-accent`,
`--ddga-empty-state-tint-bg` / `-fg` , derive from the status (`info|success|warning|error`). Re-theme
by changing those semantic colors, or override the status variant class.

Full list per component: `grep '\-\-ddga-' node_modules/@dev-dga/css/dist/components/<name>.css`.

---

## 4. Component props (a non-CSS axis)

Appearance is also chosen through the API: `variant`, `size`, `colorScheme` (`<Button variant="outline"
size="sm">`, `<Card variant="elevated">`, `<Badge colorScheme="success">`). Read each component's
`.tsx`/`.stories.tsx` for its options.

---

## 5. Dark mode & RTL

- **Dark:** triggered by `data-theme="dark"`. It re-points the tokens marked ✅ above (palette scales,
  spacing, radius, fonts stay constant). Override your dark values under `[data-theme='dark'] { … }`.
  Apply the attribute on the element whose subtree should flip (this demo sets it on `<html>` in
  `src/AppRoot.tsx`, plus a pre-paint script in `index.html` to avoid a flash on reload).
- **RTL:** `<DgaProvider dir="rtl">` flips logical layout for its subtree (layout only , composes with
  any theme). This demo also mirrors `dir`/`lang` onto `<html>`.

---

### Sources

- `@dev-dga/tokens/dist/index.{d.ts,js}` , `DgaTheme`, `PaletteName`, `buildTheme`, `applyPrimary`, defaults.
- `@dev-dga/css/dist/index.css` , global tokens, `.ddga-theme-*`, `[data-theme=dark]`; `components/*.css` , per-component vars.
- `@dev-dga/react/dist/index.d.ts` , `DgaProviderProps` (`dir`, `locale`, `mode`, `theme`, `as`, `className`, `style`; `style` wins over `theme`).
