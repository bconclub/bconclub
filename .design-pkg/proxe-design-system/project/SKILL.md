---
name: proxe-design
description: Use this skill to generate well-branded interfaces and assets for PROXe, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map of this skill

- `README.md` — full visual + content foundations. Start here.
- `colors_and_type.css` — design tokens (CSS vars + base classes). Import this first in any HTML file.
- `assets/logo/` — PROXe wordmark + icon (white / dark / favicon).
- `assets/icons/` — Hugeicons-style stroke icons (channel set).
- `assets/imagery/` — Product imagery (cinematic, dark, violet-tinted).
- `preview/` — Per-token specimen cards (the Design System tab).
- `ui_kits/website/` — Hi-fi click-thru recreation of `bconclub.com/proxe`. Lift sections from here when building a marketing-style page.

## Quick rules
- **Headings: Instrument Serif** (italic for emphasis). **Body: Exo 2.** Never substitute Inter/Roboto/system.
- Surfaces are **violet-tinted glass on near-black** (`#0A0A0A` + two fixed radial blooms). Never flat black.
- Glass recipe: 160deg violet gradient → dark, `rgba(79,13,202,0.32)` border, `24px` radius, `blur(28px)`, deep violet shadow + 1px inner top highlight.
- Channels each have a gradient identity (Web / WhatsApp / Voice / Social / Email / SMS) — apply via CSS mask on icons.
- Tone is direct, second-person, end-stop sentences. Brand is always **PROXe** (cap-X-cap).
- Hover lifts cards `-4px` and brightens the violet border. Never scale.
