# Visual style guide

This site uses a restrained technical-field-guide direction: software and competition operations should feel precise, calm, and human. The global stylesheet remains the implementation source of truth.

## Foundations

- Keep the existing paper, navy, blue, and pale-blue token palette. Add a semantic token before introducing a colour.
- Use a robust system sans-serif stack throughout. Headings are tightly tracked, heavy, and fluid; compact metadata is uppercase and letter-spaced.
- Content is capped at 1240 px with shared fluid gutters and section spacing. Fine rules, not rounded cards or shadows, establish structure.
- The navy section is reserved for meaningful contrast: current roles, technology groups, and judging responsibilities.

## Layout

- Every page has a persistent top header, one primary h1, editorial masthead, and modular records below.
- Use timelines, tables, ordered lists, and linked rows for achievements and professional history. Tables must preserve header associations and scroll horizontally rather than clip on narrow screens.
- Home introduces the software, competing, and judging tracks equally. Detail pages focus on one subject; no decorative or fabricated imagery is used.
- New-tab links require rel="noreferrer". Top navigation and locale navigation use ordinary links so they work without JavaScript.

## Accessibility and responsive behaviour

- Preserve the skip link, visible focus, semantic landmarks, native mobile disclosure navigation, and reduced-motion support.
- Start at 320 px. At narrow widths, record grids collapse to one column and tables remain readable through their containing horizontal scroll area.
- Never fix content heights, hide translated text, rely on hover alone, or use colour as the sole indication of state.
- Review 320, 768, and 1280 px in English, Catalan, and Spanish; especially check the longer record text and 200% browser zoom.
