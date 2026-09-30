# PROXe Website UI Kit

A click-thru, hi-fi recreation of the PROXe marketing site (`bconclub.com/proxe`).
Source-of-truth: the `bconclub/proxe-site` repo (`proxe/src/components/*`,
`proxe/src/styles/theme.css`, `brand.config.ts`) + the live page.

## Components

| File | Purpose |
| --- | --- |
| `Header.jsx`      | Floating glass-pill header (23px radius), brand + nav + Deploy CTA |
| `Hero.jsx`        | Serif headline + chat-style searchbar + quick-pill prompts |
| `Channels.jsx`    | "One PROXe. Every channel." — Web / WhatsApp / Voice / Social glass cards with channel-tinted glows |
| `Features.jsx`    | Capture / Remember / Close — 3-up serif-titled glass cards |
| `Stats.jsx`       | KPI band (1M+, < 2s, 142%, 99.9%) on violet glass |
| `Footer.jsx`      | Big "Deploy PROXe" CTA card + minimal legal row |
| `ChatWidget.jsx`  | The hero interaction: floating violet bubble → AI conversation, scripted replies |

## Click-thru interactions
- Type a prompt in the hero searchbar (or hit any quick-pill) → the **chat widget** opens with that prompt threaded.
- The chat has scripted answers for the canonical prompts (`Pricing`, `Book a Demo`, `Schedule a Call`, etc.), with a generic AI fall-through for anything else.
- Hover any channel card to lift + reveal its tinted glow.
- The Deploy buttons in header + footer also pipe into the chat.

## Stylesheet
`site.css` is the single CSS file for the kit. It imports `colors_and_type.css`
for design tokens. All component styles are namespaced `.px-*`.

## What was intentionally cut
- The dynamic per-page glow/gradient system (`PageGlowProvider`) is replaced
  with a single fixed body-level violet bloom — the visual feel is preserved,
  the runtime cost isn't.
- Pricing tiers, the testimonials carousel, and the fully-fledged WhatsApp /
  Voice product pages — the kit covers the home flow only.
- Form submission + analytics — the chat is fully scripted.
