# PROXe Design System

PROXe is **the AI Customer Acquisition System** — it captures every lead,
nurtures the conversation, scores intent, and pushes ready buyers to a human
team. It runs across **Website, WhatsApp, Voice, Email, SMS** and is built for
SMBs that lose deals to slow follow-ups and dead silence.

This project is the visual + interaction reference for designing PROXe surfaces
— marketing site, product UI, decks, mocks, and one-off experiments.

---

## Sources

| Source | Path / URL |
| --- | --- |
| Live marketing site (visual ground truth) | https://bconclub.com/proxe |
| Marketing-site codebase                   | `bconclub/proxe-site` (`proxe/` subfolder) |
| Theme tokens                              | `proxe/src/styles/theme.css`, `proxe/src/styles/globals.css` |
| Brand config                              | `proxe/src/configs/brand.config.ts` |
| Page composition                          | `proxe/src/app/page.tsx`, `proxe/src/app/page.module.css` |
| Component library                         | `proxe/src/components/*` |
| Sibling repos (linked products)           | `bconclub/proxe`, `bconclub/proxe-whatsapp`, `bconclub/voice-proxe`, `bconclub/goproxe.com` |

> Reader assumption: **none.** Everything you need to design with PROXe ships
> in this folder. The links above are kept so you can dive deeper if you have
> access.

---

## Index — what's in this folder

```
README.md                  ← you are here
SKILL.md                   ← invocation contract for this design system
colors_and_type.css        ← design tokens (vars + base classes)

assets/
  logo/                    ← PROXe wordmark + icon, white / dark / favicon
  icons/                   ← Hugeicons-style stroke icons (channel set)
  imagery/                 ← Product imagery (Command-Center, Models, etc.)

preview/                   ← One-card-per-token specimens (Design System tab)
  type-* colors-* spacing-* components-* brand-*

ui_kits/
  website/                 ← Hi-fi recreation of bconclub.com/proxe
    index.html             ← click-thru prototype
    site.css               ← all kit styles, namespaced .px-*
    Header / Hero / Channels / Features / Stats / Footer / ChatWidget .jsx
    README.md              ← what's in / out, how to use
```

---

## Content fundamentals

PROXe writes like a **closer** — short, declarative, end-stop confidence. No
hedging, no marketing hand-waving. The reader is a busy SMB owner who has
already lost a deal this week.

### Voice
- **Second-person.** "**You** lose deals to slow follow-ups." Not "businesses lose…"
- **Verb-first imperatives.** "Capture every lead." "Never miss another inquiry." "Deploy in under 2 hours."
- **End on a period.** Three short sentences > one long one. The cadence is the rhythm.
- **PROXe is the agent**, written almost like a person. "PROXe captures every lead." "PROXe never sleeps."

### Casing & punctuation
- **PROXe** — title-case-with-internal-cap. Always exactly that. Never "Proxe", "PROxe", or "proxe".
- **Hero + feature titles use Title Case.** "Never Miss a Lead Ever Again." "From First Ping to Closed Deal." "One PROXe. Every Channel." Capitalize every meaningful word.
- **Body, sub-copy, and UI copy stay sentence case.** Eyebrow labels are ALL CAPS with `0.14–0.16em` tracking.
- **Headlines end on a period.** That terminal `.` is part of the brand voice.
- Numbers loud and specific: `1M+`, `< 2s`, `142%`, `99.9%`. Never spelled out.

### Tone signals
- **Direct, slightly cocky, never cute.** The product is a fix for a real problem; copy doesn't dance around it.
- **Channel names are concrete.** Always WhatsApp, Voice, Email, SMS, Website.
- **One-line value props.** "AI sales agent that lives on your site 24/7."
- **Emoji: rare and conversational.** A `👋` shows up in chat to feel human; never on the marketing site itself.

### Examples in the wild
- Eyebrow: *"AI Customer Acquisition"*  (small caps, wide-tracked)
- Hero: *"Never Miss a Lead Ever Again."*
- CTA: *"What's PROXe? →"* (a question + a black-knob arrow)
- Feature: *"Capture / Never Miss a Lead / Every message captured. WhatsApp, website, Instagram, SMS, email. 24/7 listening. No inquiry lost."*

---

## Visual foundations

The PROXe look is **electric violet, film grain, dark vignette**. Think a
saturated indigo studio backdrop with a dusty 35mm scan over the top — vivid,
loud, and a little physical.

### Color
- **The page background is a single large radial gradient**, sampled from the live hero (`assets/imagery/hero-gradient-reference.png`). It is NOT a flat plate. The gradient is the page color.
  - Hot-spot: `#7916FF` at ~`22% 28%` (upper-left)
  - Mid-fall: `#4B1FE5` at ~42%
  - Anchor:   `#100442` at the lower-right (100%)
  - Use `var(--bg-hero-gradient)` — the exact stop list is in `colors_and_type.css`.
- **Three fixed layers on every full-bleed page** (apply `.px-page-bg` to `<body>`):
  1. **Hero gradient.** The radial above — does most of the visual work.
  2. **BR vignette.** A second radial in the bottom-right (`rgba(7,0,33,0.70) → 0`) that pushes the corner past the gradient's own anchor into near-black.
  3. **Film grain.** `assets/imagery/grain.png`, **220px tile**, **opacity 0.16**, **`mix-blend-mode: overlay`**. The single biggest brand signal — never skip it. Without it the gradient looks digital; with it the page reads as a 35mm scan.
- **Depth inside cards** stays in the violet family — use `--proxe-violet-deep` (#2A0EAF) and `--proxe-violet-darkest` (#100442) for inset shadows, pressed states, and dark accents. The system has **no purple, no blue, no cyan** — just violet, white, black.
- **Text is white-on-violet** at `100 / 92 / 78 / 62 / 40%` alpha steps. White is the only ink.
- **The CTA pattern is white pill + black knob.** Not glass, not violet — solid `#FFFFFF` background with a `#0A0A0A` circle holding the arrow. This is the most recognizable component in the system.
- **Channels each carry a gradient identity** (Web blue→green, WhatsApp lime→forest, Voice cream→amber, Social pink→violet). Used in icons via CSS mask, never as page colors.

### Type
- **Headings: Instrument Serif** at 400, regular roman (italic only for explicit emphasis, not by default). Hero is `66–96px`, section heads `36–56px`, feature titles `~28px`. Tight tracking `-0.02em`, line-height `1.05–1.1`.
- **Body / UI: Exo 2.** Body 14–16/1.55, eyebrow 12/0.14–0.16em uppercase 600.
- **Hero is set in Title Case Roman serif** — no italic emphasis on the main headline. Italic is reserved for inline emphasis inside body copy.

### Shape & elevation
- **Radii.** `999px` rules — header pill, ask bar, quick-pills, CTAs, deploy button, chat bubbles. Big rounded squircles (`22–24px`) for cards. Sharp corners are absent.
- **Borders.** Frosted cards wear `1px solid rgba(255, 255, 255, 0.22)` brightening to `0.40` on hover. The border is what reads against violet — no violet-on-violet edges.
- **Shadows are deep-violet, not black.** `0 18px 40px rgba(16, 4, 66, 0.40)` with `inset 0 1px 0 rgba(255, 255, 255, 0.10)` for the top-edge sheen. The vignette color (`#100442`) is the shadow color.

### Backgrounds & imagery
- **One background, everywhere.** The hero radial gradient + BR vignette + grain. No second gradient mesh, no aurora, no flat plate.
- **Product imagery** is rendered, dark, cinematic. No stock people, no flat illustration.
- **Full-bleed page only** — content lives in a `1180px` content column.

### Motion
- **Easing.** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` for entries; `cubic-bezier(0.4, 0, 0.2, 1)` for state changes.
- **Hover.** Cards lift `-4px` and brighten their border + bg by 4%. Buttons translate `-1px`. No scale.
- **Press.** Returns translate to `0`. No shrink.
- **Entries.** Fade + 12px slide up, 280ms.
- **No always-on motion** — the chat FAB doesn't pulse, the bloom is static. Stillness is the default.

### Frosted card recipe
```
background:        rgba(255, 255, 255, 0.06);
border:            1px solid rgba(255, 255, 255, 0.22);
border-radius:     22px;
backdrop-filter:   blur(28px) saturate(140%);
box-shadow:        0 18px 40px rgba(16, 4, 66, 0.40),
                   inset 0 1px 0 rgba(255, 255, 255, 0.10);
```
Use it for cards, panels, the chat surface. Header + ask bar bump backdrop blur to `blur(20px) saturate(180%)` and the white-pill CTA forgoes glass entirely.

### Layout
- **Page max-width: 1180px**, padded `32px`.
- **Vertical rhythm: 80–96px section padding** desktop.
- **8pt spacing scale** end-to-end.
- **Header is fixed** at `top: 16px`, max-width 960px, full-pill 999px radius.
- **Single column on mobile** — channel + feature grids collapse to `auto-fit, minmax(220px, 1fr)`.

### What to avoid
- ❌ Near-black or dark-mode-app backgrounds (the page is violet, full stop)
- ❌ Skipping the grain — without it, the violet looks like an unfinished placeholder
- ❌ Italic hero headlines (italic is for inline body emphasis only)
- ❌ Sentence-case hero titles (Title Case for hero/feature titles)
- ❌ Gradient backgrounds on CTAs (white pill + black knob, always)
- ❌ Inter / Roboto / system stacks for headings

---

## Iconography

PROXe's icon system is **Hugeicons** (`stroke-rounded` style) — 1.5px stroke, rounded joins, optical center inside a 24px box. Use CSS masks to tint with channel gradients.

- **Format.** SVG, copied locally into `assets/icons/`. Raster fallbacks live in `assets/icons/raster/`.
- **Usage pattern.** `-webkit-mask-image: url(...); background: linear-gradient(channelFrom, channelTo);`
- **Sizing.** 36px in cards, 24–28px inline, 20px in dense lists.
- **Always stroke**, never duotone or filled.
- **Emoji.** `👋` only inside chat bubbles. Never on the marketing site.
- **Unicode glyphs.** `→` for CTAs, `+` for expand, `↑` for chat-send, `×` for close.

> Need a glyph? Pull from [hugeicons.com](https://hugeicons.com) (Stroke / Rounded set) into `assets/icons/`.

---

## How to use this system

1. **Always start with `colors_and_type.css`.** Every variable is named, scoped, and sourced.
2. **Need a hi-fi page?** Lift sections from `ui_kits/website/`. Components are namespaced `.px-*` and don't leak.
3. **Need a deck or a one-off mock?** Use the tokens, the glass recipe, the serif/sans pairing, and the iconography rules above. Don't invent a new color, don't reach for Inter, don't drop the bloom.
4. **Need a new component?** Build it from glass + serif + sans first. Read the visual foundations section before adding anything new.

If you're an AI agent working with this system, also read `SKILL.md` — it's
the contract for invoking PROXe-flavored design end-to-end.
