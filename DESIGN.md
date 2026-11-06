---
name: "Thanapat Pisavong — Architectural Engineering Folio"
description: "Drafting Vellum & Prussian Blueprint specification system for Thanapat Pisavong's bilingual CV & Systems Engineering Portfolio."
colors:
  signal-vermilion: "#9a3412"
  signal-vermilion-hover: "#7c2d12"
  validation-forest: "#166534"
  validation-tint: "#e3efe6"
  vellum-outer: "#efece4"
  vellum-sheet: "#f5f2eb"
  vellum-recessed: "#eae6dc"
  vellum-elevated: "#faf8f3"
  prussian-ink: "#102238"
  slate-ink-secondary: "#243447"
  slate-ink-muted: "#425264"
  vellum-rule-muted: "#b8b3a6"
  blueprint-dark-outer: "#101824"
  blueprint-dark-sheet: "#152030"
  blueprint-dark-recessed: "#1b2a3e"
typography:
  display:
    fontFamily: "'Archivo', 'Sarabun', sans-serif"
    fontSize: "68px"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "'Archivo', 'Sarabun', sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Archivo', 'Sarabun', sans-serif"
    fontSize: "25px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Sarabun', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'Commit Mono', monospace"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.04em"
    fontFeature: "tabular-nums"
rounded:
  none: "0px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.signal-vermilion}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.signal-vermilion-hover}"
  button-secondary:
    backgroundColor: "{colors.vellum-sheet}"
    textColor: "{colors.prussian-ink}"
    rounded: "{rounded.none}"
    padding: "10px 18px"
  button-secondary-hover:
    backgroundColor: "{colors.prussian-ink}"
    textColor: "{colors.vellum-sheet}"
  chip-spec:
    backgroundColor: "{colors.vellum-recessed}"
    textColor: "{colors.prussian-ink}"
    rounded: "{rounded.none}"
    padding: "3px 8px"
---

# Design System: Thanapat Pisavong — Architectural Engineering Folio

## Overview

**Creative North Star: "The Architectural Engineering Folio"**

This design system treats a senior-caliber software and systems engineer's dossier as a bound set of physical drafting sheets (`DOC // TP-CV-2026`). Instead of relying on decorative gradients, glowing neon cards, or frosted glass overlays, authority is established through exposed structural geometry: warm drafting vellum paper planes (`#efece4` and `#f5f2eb`), high-density Prussian blueprint ink keylines (`#102238`), tabular monospace title blocks, and verifiable production specifications across pharmaceutical GMP manufacturing, SAP Business One ERP synchronization, AWS cloud infrastructure, and native Android Auto projection.

Every section behaves as a numbered specification sheet with a flush-mounted header bar, reference code (`REF // PROFILE-SUMMARY`, `DRAWING // SYS-ARCH-01`, `MATRIX // RUNTIME-CALIBRATION`), and hair-ruled internal cells. Bilingual Thai and English technical prose coexists seamlessly through a paired grotesque-and-humanist typographic hierarchy.

**Key Characteristics:**
- Flush-joined architectural sheet frames (`2px solid #102238`) with exposed `1px solid` internal cell dividers and zero border radius (`0px`).
- Tonal drafting-vellum paper hierarchy (`#efece4` outer ground, `#f5f2eb` primary sheet, `#eae6dc` recessed title blocks) paired with a dark Prussian Blueprint mode (`#101824` / `#152030`).
- Tabular monospace specification metadata (`Commit Mono` with `tabular-nums`) for document codes, date spans, runtime calibration percentages, and architecture flow pills.
- Zero drop shadows, zero decorative `backdrop-filter` blur, and zero eyebrow kickers above headings.

## Colors

The palette pairs warm, low-glare drafting vellum neutrals with deep Prussian blueprint ink and two high-contrast functional signal accents.

### Primary
- **Signal Vermilion** (`#9a3412`, hover `#7c2d12`): Used strictly for primary action triggers (`VIEW 12 PRODUCTION SYSTEMS →`, active audio/theme controls on hover), Thai name subtitles, and tabular reference codes (`sheet-ref`). Meets WCAG AA/AAA contrast (`6.69:1` on `#eae6dc` and `8.33:1` against `#ffffff`).

### Secondary
- **Validation Forest Green** (`#166534`, surface tint `#e3efe6`): Used for live production status indicators (`pulse-dot`), primary engineering role subheadings, GxP validation metrics, and domain classification callouts (`LIVE // PHARMA GMP`, `LIVE // ERP INTEGRATION`, `LIVE // AUTOMOTIVE SDK`).

### Neutral
- **Vellum Outer Ground** (`#efece4`): The ambient drafting table canvas surrounding the folio sheets.
- **Vellum Sheet Ground** (`#f5f2eb`): The primary surface of each bordered specification sheet.
- **Vellum Recessed Cell** (`#eae6dc`): Used for title-block headers, metadata sidebars, and footer ledgers to separate structural chrome from reading cells without shadows.
- **Prussian Blueprint Ink** (`#102238`): Primary typographic ink, `2px` outer sheet frames, `1px` cell rules, and inverted action buttons (`DOWNLOAD CV PDF`, `SPEC →`, `Deep Dive / Architecture`).
- **Slate Secondary Ink** (`#243447`) & **Muted Technical Ink** (`#425264`): Used for long-form bilingual descriptions and secondary technical notes.
- **Dark Blueprint Linen Grounds** (`#101824` outer, `#152030` sheet, `#1b2a3e` recessed): Activated via `[data-theme="dark"]` for low-light engineering review.

### Named Rules
**The Ink-And-Paper Rule.** Hierarchy is created by switching between `#f5f2eb` (sheet) and `#eae6dc` (recessed header/ledger) across a `1px` or `2px` solid `#102238` rule—never by translucent overlays or drop shadows.

**The Dual-Signal Rule.** Vermilion (`#9a3412`) signals interactive actions and document index codes; Forest Green (`#166534`) signals live production status and verified engineering metrics. Never mix their semantic roles.

## Typography

**Display Font:** `'Archivo'` (with `'Sarabun', sans-serif` fallback)
**Body Font:** `'Sarabun'` (with system sans-serif fallback)
**Label/Mono Font:** `'Commit Mono', monospace`

**Character:** Heavy industrial grotesque headings (`Archivo` 700–800) anchor the drafting sheets with crisp architectural authority, while `Sarabun` renders Thai diacritics and English technical prose at comfortable reading measure (`60ch–72ch`), and `Commit Mono` locks codes, dates, and percentages to a rigid tabular grid.

### Hierarchy
- **Display (`h1`)** (`800`, `68px` desktop / `36px` mobile, `line-height: 0.96`, `letter-spacing: -0.03em`): Used once in the first viewport for `THANAPAT PISAVONG`.
- **Headline (`h2`)** (`800`, `32px`, `line-height: 1.15`, `letter-spacing: -0.01em`): Used for modal deep-dive titles and primary role headers (`22px` tracked `0.04em` in `.hero-header h2`).
- **Title (`h3`)** (`800`, `25px`, `line-height: 1.2`, `letter-spacing: -0.01em`): Used for flush sheet headers (`PROFESSIONAL WORK EXPERIENCE`, `FEATURED ENTERPRISE & PRODUCTION PROJECTS`) and flagship matrix titles (`20px`).
- **Sub-Title (`h4`)** (`700`, `20px`, `line-height: 1.28`): Used for individual project titles in the 12-system matrix, topology nodes, and 6-domain stack categories.
- **Body** (`400` / `600`, `16px`, `line-height: 1.65`, max measure `72ch`): Used for bilingual Thai/English engineering descriptions and bullet lists.
- **Label / Spec Mono** (`700`, `12px`, `line-height: 1.4`, `letter-spacing: 0.04em`, `font-variant-numeric: tabular-nums`): Used for title bars, reference stamps, timeline dates, filter tabs, and tech badges.

### Named Rules
**The No-Eyebrow Rule.** Headings (`h1`–`h4`) never carry a small uppercase kicker or badge directly above them. Reference codes (`REF // ...`) sit on the far right of the flush header bar (`justify-content: space-between`), and status tags (`LIVE // PHARMA GMP`) sit below the heading.

**The 12px Floor Rule.** No functional label, caption, badge, or metadata string may drop below `12px`.

## Layout

The page is centered inside `.folio-shell` (`max-width: 1440px`, `padding: 24px` desktop / `8px` mobile). Each major section is an independent `.folio-sheet` (`border: 2px solid var(--rule-strong)`, `margin-bottom: 24px`, `padding: 0`) whose internal header bars and grid cells flush-join directly into the outer sheet walls.

- **First Viewport (`#hero.folio-sheet`):** Structured as a 3-row drafting sheet:
  1. Top `.title-bar` (`min-height: 58px`, `border-bottom: 2px solid`, 4 ruled cells: `DOC // TP-CV-2026`, live status, voice/theme/lab controls, and `DOWNLOAD CV PDF`).
  2. Central `.main-grid` (`440px` left identity column with `border-right: 2px solid` and `minmax(0, 1fr)` right column containing `.hero-header` and the 3-column `.spec-matrix`).
  3. Bottom `.footer-ledger` (`border-top: 2px solid`, 4 tabular metric cells + full-bleed Vermilion CTA cell).
- **Sticky Section Index (`.folio-index-bar`):** Pinned at `top: 0` (`z-index: 90`, `border: 2px solid`) for single-click jumps across all 8 dossier sheets.
- **Responsive Breakpoints:**
  - `1200px`: Collapses 3-column and 4-column matrices to 2 columns; `.main-grid` narrows left column to `380px`.
  - `960px`: Stacks `.main-grid`, `.split-two-sheet`, `.split-three-sheet`, `.timeline-item`, and `.spec-matrix` into a single `minmax(0, 1fr)` column; activates `.mobile-menu-btn`.
  - `680px`: Single-column layout across all grids; constrains `.portrait-plate-wrap` to `max-width: 210px` (`height: 220px` on `.profile-img`).

## Elevation & Depth

This system is strictly **flat-by-default and shadow-free**. There are zero `box-shadow` declarations and zero `backdrop-filter` blurs anywhere in the stylesheet. Depth and containment are communicated exclusively through:
1. Line-weight hierarchy (`2px solid` outer sheet frames and primary section dividers vs. `1px solid` internal cell dividers).
2. Surface value steps (`#efece4` outer ground → `#f5f2eb` sheet ground → `#eae6dc` recessed header/sidebar ground → `#faf8f3` hover elevation).
3. High-contrast surface inversion on interactive hover (`#102238` background with `#f5f2eb` text, or `#9a3412` background with `#ffffff` text).

### Named Rules
**The Zero-Shadow Rule.** Never add ambient, drop, or hard-offset `box-shadow` to cards, buttons, or modals. Separation is structural (`1px`/`2px` solid rules), never atmospheric.

## Shapes

Every container, button, portrait frame, badge, progress bar, and modal dialog uses crisp `90-degree` architectural corners (`border-radius: 0px`).
- **Portrait Plate (`.portrait-plate-wrap`):** Framed as a mounted rectangular photographic plate (`border: 2px solid #102238`, `background: #102238`, `padding: 8px`) with a bottom monospace plate caption (`PLATE 01 // THANAPAT PISAVONG`). Circular or pill portrait masks are strictly prohibited.
- **Topology Connectors (`.connector-line.horizontal`):** `2px` solid horizontal rules terminated with monospace directional arrowheads (`◀` and `▶`).

## Components

### Buttons
- **Shape:** Square corners (`border-radius: 0px`), `1px solid` structural border, `Commit Mono` `12px` bold (`letter-spacing: 0.03em`).
- **Primary (`.btn-main`, `.cta-cell`):** `#9a3412` background, `#ffffff` text, transitions to `#7c2d12` over `150ms cubic-bezier(0.22, 1, 0.36, 1)`.
- **Inverted Action (`.primary-pdf-cell`, `.btn-project-detail`, `.spec-jump-btn`):** `#102238` background, `#f5f2eb` text, `white-space: nowrap`, transitions to `#9a3412` background with `#ffffff` text on hover.
- **Secondary / Control (`.language-btn`, `.audio-btn`, `.theme-btn`, `.header-lab-btn`, `.projects-btn`):** `#f5f2eb` or `#eae6dc` background, `#102238` text, `1px solid #102238` border.

### Chips & Badges
- **Style (`.badge`, `.hero-chip`, `.node-tags span`):** Square corners (`0px`), `#eae6dc` background, `#102238` text, `1px solid #102238` border, `padding: 3px 8px`, `Commit Mono` `12px` bold with `tabular-nums`.

### Specification Cells & Containers
- **Corner Style:** `0px` radius.
- **Background:** `#f5f2eb` default cell ground, shifting to `#faf8f3` on hover in `.portfolio-item`.
- **Border:** Flush-joined `1px solid #102238` right and bottom cell rules inside a `2px solid #102238` `.folio-sheet`.
- **Internal Padding:** `24px` on desktop (`16px` on mobile) for content cells; `0px` on outer `.folio-sheet` and `.sheet-cell` wrappers so header bars meet the sheet walls edge-to-edge.

### Navigation (`.folio-index-bar`)
- **Style:** Sticky horizontal bar (`border: 2px solid #102238`, `background: #f5f2eb`, `padding: 8px 12px`). Links use `Commit Mono` `12px` bold (`padding: 8px 14px`) and invert to `#102238` background with `#f5f2eb` text when `.active` or `:hover`.

### Custom Disclosure Drawer (`.project-seo-drawer`)
- **Style:** Native `<details>` element styled with `border: 1px solid #b8b3a6`, `background: #eae6dc`, `padding: 8px 12px`, default browser marker suppressed (`list-style: none`), replaced with a custom monospace `+` / `−` indicator in `#9a3412`.

## Do's and Don'ts

### Do:
- **Do** flush-join `.title-bar`, `.sheet-heading-bar`, `.sheet-section-header`, and `.footer-ledger` directly into the `2px solid` outer borders of `.folio-sheet` (`padding: 0` on the sheet wrapper).
- **Do** apply `font-variant-numeric: tabular-nums` to all dates, counters, skill percentages, document codes, and contact numbers.
- **Do** keep `white-space: nowrap; flex-shrink: 0;` on compact action triggers like `SPEC →` (`.spec-jump-btn`).
- **Do** preserve 100% of verified bilingual Thai and English engineering data and JSON-LD structured data when updating layout or styling.

### Don't:
- **Don't** place an eyebrow kicker, badge, or category pill directly above an `h1`, `h2`, `h3`, or `h4` element.
- **Don't** introduce `border-radius`, `box-shadow`, `backdrop-filter: blur()`, or gradient text (`background-clip: text`).
- **Don't** crop portraits into circles (`border-radius: 50%`) or allow the mobile portrait plate to stretch into a full-width landscape banner.
- **Don't** use font sizes below `12px` on any visible label, caption, or badge.

