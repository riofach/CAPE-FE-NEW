---
name: Catatan Pengeluaran (CAPE)
description: An AI-assisted personal expense tracker with a soft, touchable claymorphism aesthetic.
colors:
  clay-bg: "#f0f4f8"
  clay-surface-green: "#ecfdf5"
  clay-surface-lime: "#f7fee7"
  clay-pastel-green: "#d1fae5"
  clay-pastel-lime: "#ecfccb"
  ink-primary: "#1e293b"
  ink-body: "#475569"
  ink-muted: "#94a3b8"
  accent-emerald: "#10b981"
  accent-emerald-deep: "#059669"
  accent-lime: "#84cc16"
  accent-teal: "#14b8a6"
  semantic-income: "#059669"
  semantic-expense: "#e11d48"
  semantic-balance-positive: "#2563eb"
  semantic-balance-negative: "#ea580c"
  shadow-dark: "#c8d0e7"
  shadow-dark-sm: "#d1d9e6"
  shadow-light: "#ffffff"
typography:
  display:
    fontFamily: "Quicksand, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Quicksand, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Quicksand, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  body-emphasis:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.55
  label:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent-emerald}"
    textColor: "{colors.shadow-light}"
    typography: "{typography.label}"
    rounded: "{rounded.2xl}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-emerald-deep}"
    textColor: "{colors.shadow-light}"
  button-secondary:
    backgroundColor: "{colors.clay-bg}"
    textColor: "{colors.ink-body}"
    rounded: "{rounded.2xl}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  clay-card:
    backgroundColor: "{colors.clay-bg}"
    textColor: "{colors.ink-body}"
    rounded: "{rounded.3xl}"
    padding: "32px"
  clay-card-green:
    backgroundColor: "{colors.clay-surface-green}"
    textColor: "{colors.ink-body}"
    rounded: "{rounded.3xl}"
    padding: "32px"
  clay-input:
    backgroundColor: "{colors.clay-bg}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.2xl}"
    padding: "12px 16px"
  clay-dialog:
    backgroundColor: "{colors.clay-bg}"
    textColor: "{colors.ink-body}"
    rounded: "{rounded.3xl}"
    padding: "24px"
  stats-tile-income:
    backgroundColor: "{colors.clay-surface-green}"
    textColor: "{colors.semantic-income}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  stats-tile-expense:
    backgroundColor: "#fff1f2"
    textColor: "{colors.semantic-expense}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  toast-success:
    backgroundColor: "{colors.clay-surface-green}"
    textColor: "#065f46"
    rounded: "{rounded.2xl}"
    padding: "16px"
  toast-error:
    backgroundColor: "#fff1f2"
    textColor: "#9f1239"
    rounded: "{rounded.2xl}"
    padding: "16px"
---

# Design System: Catatan Pengeluaran (CAPE)

## 1. Overview

**Creative North Star: "The Touchable Ledger"**

CAPE is a personal-finance app dressed as a soft object. Every surface should feel like it was pressed into being — inflated, slightly soft, and physically present under the cursor. The interface treats money — usually a stressful, cold subject — as something you can hold. The user is not auditing their life; they are squeezing a friendly bean of data.

The palette is built on a cool, near-white clay (`#f0f4f8`) with pastel emerald and lime as the brand voice. Greens carry growth and ease; rose enters only to flag expense and danger. Depth never comes from a drop shadow on a flat plane; it comes from **paired light/dark shadows** that make the surface read as a raised soft body, with `inset` variants for pressed and recessed states. Color is restrained; **shadow is the design system**.

Voice is playful, witty, and Indonesian-first. The marketing surfaces are bold and atmospheric (parallax hero, oversized type, floating bean shapes). The product surfaces are softer and denser, but governed by the same physics — same shadows, same radii, same fonts. **One system, two altitudes**: marketing shouts the brand, product whispers it.

**Key Characteristics:**
- Soft claymorphism with **dual light/dark shadows** as the depth language.
- Pastel emerald/lime/teal palette anchored on a cool clay neutral (`#f0f4f8`).
- Generously rounded geometry — `rounded-2xl` for actionable elements, `rounded-3xl` for containers.
- Quicksand for display and titles, Nunito for body — both rounded, both warm.
- Lucide icons at `strokeWidth={1.5}` — never thicker, never thinner.
- Framer Motion for tactile feedback (whileHover, whileTap), gated by `useReducedMotion()`.
- Bahasa Indonesia copy with light emoji punctuation 🚀.

**The system explicitly rejects:**
- Dirty drop shadows (`box-shadow: 0 4px 24px rgba(0,0,0,…)` flat blurs).
- Generic aurora / "AI" gradients used as page-level mood.
- Pill-shape everything (`rounded-full` on cards/sections).
- Centered icon-over-label feature lists with identical card sizing.
- Plain `scale(1.05)` hovers without state-mapped shadow change.
- Lorem ipsum or corporate jargon ("seamless", "enterprise-grade", "leverage").
- Dark mode (this product is light-only by design — the clay needs natural light to read as soft).

## 2. Colors: The Soft Clay Palette

A cool-leaning neutral does the heavy lifting; emerald and lime carry the brand; rose is reserved exclusively for expense and destructive intent. **No gradients as page background.** Gradients exist only on (a) the hero headline word-mark and (b) decorative blurred blobs behind imagery.

### Primary
- **Accent Emerald** (`#10b981`, emerald-500): The single primary action color. Used on the primary `Button` background and the active state of dashboard nav links. ≤10% surface coverage on any screen.
- **Accent Emerald Deep** (`#059669`, emerald-600): Pressed/hover companion for primary emerald. Also the canonical color for **income** values and pemasukan stats.

### Secondary
- **Accent Lime** (`#84cc16`, lime-500) and **Accent Teal** (`#14b8a6`, teal-500): Reserved for atmospheric gradient pairs in marketing (hero word-mark, decorative blurred shapes). Never used as a text color on neutral backgrounds.

### Neutral
- **Clay Background** (`#f0f4f8`): The body. Every page starts here. Cards sit at the same value, separated only by shadow.
- **Clay Surface Green** (`#ecfdf5`, emerald-50): Tinted card variant for emphasis (StatsCard container).
- **Clay Surface Lime** (`#f7fee7`, lime-50): Tinted card variant.
- **Clay Pastel Green** (`#d1fae5`, emerald-100): Icon container tint.
- **Clay Pastel Lime** (`#ecfccb`, lime-100): Icon container tint.
- **Ink Primary** (`#1e293b`, slate-800): Headlines and hero typography.
- **Ink Body** (`#475569`, slate-600): All body copy, nav labels, secondary headings.
- **Ink Muted** (`#94a3b8`, slate-400): Placeholders, helper text, disabled labels.

### Shadow Palette (the real design system)
- **Shadow Dark** (`#c8d0e7`): The cool dark side of every clay surface. Cast to bottom-right.
- **Shadow Dark Small** (`#d1d9e6`): Lighter cool dark for smaller elements and inputs.
- **Shadow Light** (`#ffffff`): The light side, cast to top-left. Every clay shadow uses pure white as its light.

### Semantic
- **Income** (`#059669`, emerald-600): All positive money values.
- **Expense** (`#e11d48`, rose-600): All negative money values, destructive confirm buttons, error toasts. **Rose, never red.**
- **Balance Positive** (`#2563eb`, blue-600): Net positive saldo only.
- **Balance Negative** (`#ea580c`, orange-600): Net negative saldo only.

### Named Rules

**The Cool-Clay Rule.** The body color is exactly `#f0f4f8`. Never substitute pure white (`#ffffff`) as the body — it kills the shadow language. White appears only inside elements (icon container backgrounds, transparent overlays at `white/40`–`white/80`).

**The One Accent Rule.** Emerald-500 carries the primary action. Lime and teal are atmosphere, not actions. A page should never have two competing primary buttons in different greens.

**The Rose-for-Loss Rule.** Rose is the only red on the system, and it appears only when money leaves, an action destroys, or input errors. Never use rose as an accent color or decorative tint.

## 3. Typography

**Display & Heading Font:** Quicksand — rounded geometric sans, weights 500/700/800.
**Body Font:** Nunito — humanist rounded sans, weights 400/600/800.

**Character:** Both families share a rounded terminal — straight stems are forbidden in the design DNA. Quicksand carries the brand voice (warm, geometric, confident in oversized hero use). Nunito does the everyday work (forms, lists, secondary copy). The pairing is intentionally on the same humanist-rounded axis; the contrast is in weight and scale, not in family. **No third font.**

### Hierarchy
- **Display** (Quicksand 800, `clamp(2.5rem, 6vw, 5rem)`, line-height 1.05, tracking `-0.02em`): Hero headline. One per page, max. Gradient-clip text is permitted on a single hero word group; nowhere else.
- **Headline** (Quicksand 700, `1.5rem`, line-height 1.2): Section titles inside cards and dialogs.
- **Title** (Quicksand 700, `1.125rem`): Dialog titles, nav labels with brand emphasis, card headings.
- **Body** (Nunito 400, `1rem`, line-height 1.55): All prose. Cap at 65–75ch on long form.
- **Body Emphasis** (Nunito 600 or 800, `1rem`): Stat values, money amounts, inline emphasis.
- **Label** (Nunito 600, `0.875rem`): Form labels (above input, mb-2), nav tab text, button text inside small buttons.
- **Currency** (Nunito 800, scaled): Currency always Body Emphasis 800. Never reduce currency weight to match surrounding label weight.

### Named Rules

**The Two-Family Rule.** Three font families is indecision. CAPE is Quicksand + Nunito. No mono. No serif. No icon font (icons are SVG from Lucide).

**The Rounded Terminal Rule.** Both display and body share rounded letterforms. Pairing Quicksand with a hard-edged geometric like Inter, Manrope, or Geist would break the touchable feel. Don't.

**The Hero Gradient Rule.** Gradient-clipped text appears only on the hero on the marketing surfaces, applied to a single phrase (e.g. "Tanpa Permisi?"). Never on H2, never on dashboard. The gradient is the brand emerald → lime pair, not "AI rainbow".

**The Indonesian-First Rule.** All user-facing copy is Bahasa Indonesia. Numbers format with `id-ID` locale (`Rp` prefix, `.` as thousands separator). Emoji punctuation is allowed in marketing surfaces sparingly; product surfaces use emoji only in toast and success states.

## 4. Elevation

CAPE is not flat. CAPE uses **dual-shadow claymorphism** as its sole elevation language. Every elevated surface casts two shadows simultaneously: a cool dark to the bottom-right (`#c8d0e7` or `#d1d9e6`) and a pure white to the top-left. This produces the illusion of a soft body lit from above and to the left. The shadows are **large and diffuse**, not tight and dark — this is what separates clay from a 2014 card.

Pressed and recessed states (inputs, active buttons, inset tiles inside StatsCard) flip the language to `inset` shadows in the same color pair: dark inside top-left, light inside bottom-right. The element looks **pushed in** rather than lifted out. This binary — raised vs. recessed — is the entire vocabulary.

### Shadow Vocabulary

- **Raised — Card** (`box-shadow: 20px 20px 60px #c8d0e7, -20px -20px 60px #ffffff`): The hero card shadow. Used on `ClayCard`, `ClayDialog`, `StatsCard`, the navbar pill, and AI surfaces.
- **Raised — Card Small** (`box-shadow: 8px 8px 16px #c8d0e7, -8px -8px 16px #ffffff`): Smaller raised elements.
- **Raised — Button** (`box-shadow: 12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff`): Default button rest state. Lighter shadow color than card to read smaller.
- **Raised — Float** (`box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff`): Floating chips, secondary actions, navbar pill.
- **Recessed — Inset** (`box-shadow: inset 6px 6px 12px #b8b9be, inset -6px -6px 12px #ffffff`): Input default state and pressed button.
- **Recessed — Inset Small** (`box-shadow: inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff`): Smaller pressed elements and stat tiles inside cards.
- **Recessed — Tab Track** (`box-shadow: inset 2px 2px 4px rgba(0,0,0,0.05)`): The bg under nav tab pills. Subtle.
- **Glow — Inner Light** (`box-shadow: inset 4px 4px 8px #ffffff, inset -2px -2px 6px #a7f3d0`): The success toast inner glow. Reserved for state cells.

### Named Rules

**The Dual-Shadow Rule.** Every elevated surface casts **two** shadows. A single `box-shadow` line on a clay card is a tell that the design system was abandoned. If a third-party component ships a flat shadow, override it.

**The No Black Shadow Rule.** Shadow colors are tinted neutrals (`#c8d0e7`, `#d1d9e6`, `#b8b9be`), never `rgba(0,0,0,…)` as a hero shadow. Black-tinted shadows make plastic; cool-tinted shadows make clay. The single permitted exception is `rgba(0,0,0,0.05)` for tab track grooves where the goal is "invisible recess".

**The Raised-Becomes-Recessed Rule.** On `:hover` or `:active`, raised elements flip to their inset variant. The button does not just dim — it presses in. This is the entire interaction tactility budget; no scale shrinks past `0.95`, no translateY past `2px`.

## 5. Components

### Buttons
- **Shape:** `rounded-2xl` (24px). Pills (`rounded-full`) are reserved for the hero CTA and tag-shaped status badges only.
- **Primary:** Emerald-500 background, white text, `12px × 24px` padding (md) or `16px × 32px` (lg). Rest shadow: `6px 6px 12px #6ee7b7, -6px -6px 12px #ffffff` (emerald-tinted dual). Hover shadow flips to `inset` emerald deep + lighter emerald. `whileTap={{ scale: 0.95 }}`, `whileHover={{ scale: 1.02 }}` via Framer Motion.
- **Secondary:** Clay background, slate-600 text, dual-shadow button rest. On hover, shadow flips inset.
- **Ghost:** Transparent, slate-500 text, hover background `slate-100`. No shadow. Used for nav-adjacent dismissals.
- **Destructive (in ConfirmDialog):** Rose-500 background, rose-100/white dual-shadow, flips to rose-700/rose-400 inset on hover. Never use anywhere else.
- **Sizes:** `sm` (px-4 py-2 text-sm), `md` (px-6 py-3 text-base), `lg` (px-8 py-4 text-lg). Default `md`.

### ClayCard (Containers)
- **Corner Style:** `rounded-3xl` (32px). Non-negotiable for cards. Never smaller.
- **Background:** `#f0f4f8` (white variant), `#ecfdf5` (green variant), `#f7fee7` (lime variant). No cards on `#ffffff`.
- **Shadow:** Raised — Card.
- **Border:** `border border-white/40` — a 1px hairline of translucent white that catches highlight on the top-left edge. This is what separates a CAPE card from a Neumorphism reference.
- **Internal Padding:** `p-8` (32px) on the default card. `p-6` for denser content cards in dashboard.
- **Reveal:** `initial={{ opacity: 0, y: 20 }}` → `whileInView`, `once: true`, 0.6s ease-out. Opt out via `disableAnimation` for above-the-fold dashboards where staggered reveal would feel slow.

### Inputs (ClayInput)
- **Style:** **Recessed by default**. `bg-[#f0f4f8]` with `inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff`. The input is a groove pressed into the surface, not a raised tube.
- **Radius:** `rounded-2xl`.
- **Padding:** `px-4 py-3`.
- **Label:** Above input, `mb-2`, `text-sm font-medium text-slate-600`. Always present and visible — no placeholder-as-label.
- **Placeholder:** `text-slate-400` (`#94a3b8`). Stays at 4.5:1 against `#f0f4f8`.
- **Focus:** `focus:ring-2 focus:ring-emerald-400/50`. No border swap; the recessed shadow stays, the emerald ring layers on top.
- **Error:** `ring-2 ring-red-400/50` plus a sub-label `text-sm text-red-500` below the field.

### ClayDialog & ClayConfirmDialog
- **Container:** Card shadow on `#f0f4f8`, `rounded-3xl`, `p-6`. Max width 28rem (`max-w-md`) for content dialogs, 24rem (`max-w-sm`) for confirms. Width `calc(100% - 2rem)` on mobile.
- **Backdrop:** `fixed inset-0 bg-slate-900/30 backdrop-blur-sm`. The blur is the only sanctioned `backdrop-blur` outside of the navbar.
- **Close button:** Top-right, `w-8 h-8 rounded-xl`, white/80 background, inset-shadow groove, slate-400 → slate-600 on hover. `X` icon at `strokeWidth={1.5}`.
- **Entrance:** `opacity 0, scale 0.95, y: 20` → `1, 1, 0`. Exits with the same in reverse.
- **Confirm variants:** `danger` (rose), `warning` (amber), `info` (sky) — each with a 64×64 icon tile in `inset` glow and a colored confirm button matching the variant.

### Toasts (ClayToast)
- **Container:** `rounded-2xl` `min-w-[320px] max-w-[420px]`, top-right, stacked with `flex flex-col gap-3` in a fixed wrapper at `z-[100]`.
- **Success:** `bg-emerald-50/90`, `border-emerald-200/50`, inner glow with pastel-green inset. Icon tile `bg-emerald-100 text-emerald-600`. Title `text-emerald-800`, description `text-emerald-600`.
- **Error:** `bg-rose-50/90`, `border-rose-200/50`, inner glow with pastel-rose inset. Icon tile `bg-rose-100 text-rose-600`. Title `text-rose-800`.
- **Entrance:** Slide from right (`x: 100, scale: 0.9` → `0, 1`), spring `stiffness: 400, damping: 30`. Layout-animated stack via `<motion.div layout>`.

### Navigation
- **Marketing Navbar:** Floating pill at top of viewport. `bg-[#f0f4f8]/80 backdrop-blur-md`, `rounded-2xl`, `shadow-clay-float`, `border border-white/40`, padded `px-6 py-3`. Hides on scroll-down past 150px, returns on scroll-up. Brand link is logo + Quicksand bold "CAPE" wordmark. Nav links carry an animated underline (`bg-emerald-400`, w-0 → full on hover).
- **Dashboard Nav:** `sticky top-0`, `backdrop-blur-md bg-white/70`, `border-b border-white/40`. Internal tab group lives in a recessed inset track (`bg-slate-100/80 rounded-xl inset 2px shadow`). Active tab: white background, `text-emerald-600`, `rounded-lg`, subtle drop. Inactive: `text-slate-500`. **Tab group is the only place a flat drop shadow appears**, justified because the active tab needs to read above the recessed track.

### StatsCard (Signature Component)
- **Container:** `rounded-3xl p-6`, `bg-gradient-to-br from-emerald-50 to-teal-50`. Raised card shadow. The only sanctioned page-component gradient on the dashboard.
- **Header:** Month nav with `ChevronLeft / ChevronRight` in `w-10 h-10 rounded-xl` recessed buttons. Disabled state at `opacity-40 cursor-not-allowed`.
- **Body:** Three tiles in a `grid-cols-1 sm:grid-cols-3` grid. Each tile: `rounded-2xl p-4`, recessed inset shadow on white-tinted surface, icon tile (`w-8 h-8 rounded-lg` in semantic pastel) + label + currency. Hover: `y: -2` (gated by reduced-motion).

### AISmartInput (Signature Component)
- **Container:** Same shape and shadow as StatsCard, but `bg-gradient-to-br from-violet-50 to-purple-50`. **Violet is permitted only on AI surfaces** — it tags the feature as smart/premium without bleeding into the rest of the system.
- **Affordance:** A single-line input with a Sparkles icon and a Send action; on submit transitions to a loading spinner, then a transient success/error glow.

## 6. Do's and Don'ts

### Do:
- **Do** use the dual light/dark shadow (`20px 20px 60px #c8d0e7, -20px -20px 60px #ffffff`) on every raised surface. It is the design system.
- **Do** keep card backgrounds at `#f0f4f8` (or a tinted `*-50` surface). Cards do not sit on `#ffffff`.
- **Do** flip raised shadows to **inset** on hover/active for buttons and pressable elements — the surface presses in, never just dims.
- **Do** keep `border border-white/40` on cards and dialogs to catch the highlight edge.
- **Do** wrap motion in `useReducedMotion()` for accessibility. The reduced path collapses to `shadow-md` / `shadow-lg` Tailwind defaults rather than killing motion completely.
- **Do** use Lucide React icons at `strokeWidth={1.5}`. Always.
- **Do** keep currency values at `font-bold` (Nunito 800), formatted via `formatPrice()` with Indonesian locale.
- **Do** write Bahasa Indonesia copy. Use emoji 🚀 in marketing, sparingly in product.
- **Do** use rose-600 (`#e11d48`) for every expense and destructive action — the only red in the system.

### Don't:
- **Don't** use a single `box-shadow` line on a card. Dual shadows are non-negotiable.
- **Don't** use `rgba(0,0,0,…)` as the main shadow color on a raised surface — that makes plastic, not clay. Use the cool-tinted hex palette (`#c8d0e7`, `#d1d9e6`).
- **Don't** introduce dark mode. The clay shadow language depends on a light body.
- **Don't** use generic aurora gradients as page backgrounds. The only sanctioned gradients are (a) the hero word-mark, (b) the StatsCard surface tint, (c) the AISmartInput violet-tint, and (d) decorative blurred blobs behind imagery (`mix-blend-multiply filter blur-xl`).
- **Don't** use `rounded-full` on cards or content containers. Pills are for the hero CTA and chip-shaped badges.
- **Don't** introduce a third font family. Quicksand + Nunito only.
- **Don't** pair Quicksand with a hard-edged sans (Inter / Manrope / Geist). The terminals must stay rounded.
- **Don't** gradient-clip body text or H2/H3 headings. Hero word-mark only.
- **Don't** use placeholder text as a substitute for a visible label.
- **Don't** use `border-left: 4px solid …` as a colored side-stripe accent. Use full borders, tinted backgrounds, or leading icons.
- **Don't** ship `scale(1.05)` hovers without a coupled shadow change. Hover must change both scale **and** shadow language.
- **Don't** use lorem ipsum or corporate jargon ("seamless", "enterprise-grade", "leverage", "next-generation"). Sample copy must be Indonesian and product-specific ("Kopi Starbucks 45k", not "Lorem ipsum").
- **Don't** drop violet outside of AI-tagged surfaces. Violet is a feature tag, not an accent.
- **Don't** mix the marketing parallax/atmospheric language into the dashboard. Dashboard is denser, calmer, no parallax, no scroll-driven scaling.
