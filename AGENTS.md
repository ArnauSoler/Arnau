# Website contribution guide

This repository builds Arnau Soler's multilingual personal site with Astro. Keep it fast, accessible, static-hostable, and easy for another contributor or coding agent to inspect.

## Start here

- Install the Node 24 toolchain and run `npm ci`.
- Run `npm run inspect` before broad repository reads; use `npm run find -- --scope <code|content|i18n|styles> <query>` for focused searches.
- Start the local site with `npm run dev`. Build deployable files with `npm run build`; Plesk receives the contents of `dist/`.
- Run `npm run check:fast` during development and `npm run check` before handoff. Use `npm run screenshots` after visual changes and `npm run audit` after performance or SEO changes.

## Architecture and sources of truth

- `src/pages/` defines routes. English is `/`; Catalan and Spanish are `/ca/` and `/es/`.
- `src/components/` and `src/layouts/` contain shared semantic markup. Do not duplicate a page to translate it.
- `src/i18n/{en,ca,es}.json` contains user-facing copy. The English file defines the required shape; keep every locale structurally identical.
- `src/styles/global.css` contains the implementation tokens and components. `STYLES.md` defines the intended visual behavior.
- `commands/` contains compact inspection and validation utilities. Prefer extending these utilities over documenting manual, error-prone checks.

## Implementation rules

- Use semantic HTML and native controls before ARIA. Preserve keyboard access, visible focus, reduced motion, and useful behavior without JavaScript.
- Astro components render static HTML by default. Add client-side JavaScript or a UI framework only for an interaction that genuinely needs it, and hydrate the smallest possible island.
- Use tabs in Astro, CSS, TypeScript, and JavaScript. Let Prettier, ESLint, Stylelint, Astro check, and HTML Validate enforce mechanical rules.
- Reuse existing components and CSS custom properties. Do not add one-off colours, fonts, spacing values, `!important`, or third-party scripts for appearance.
- Use root-relative internal URLs because the confirmed deployment target is the domain root. External new-tab links require `rel="noreferrer"`.
- Ask before adding a production dependency, build integration, analytics, cookie, remote font, or external service.

## Content, localization, and privacy

- Update English, Catalan, and Spanish together. Use `npm run translations -- <query>` and `npm run check:translations` to review parity.
- Keep translations plain text; compose emphasis and markup in Astro components. Use natural localized punctuation and test longer Catalan and Spanish strings without fixed-height assumptions.
- Set localized document language, title, description, canonical URL, Open Graph copy, and `hreflang` whenever a route is added.
- Never invent or expose an email address, phone number, employer detail, credential, project result, tracking identifier, or social link.
- A future contact form must post to an approved server-side endpoint, validate again on the server, provide accessible status/error feedback, and keep all credentials out of the static bundle.

## Verification and handoff

- `npm run check` must pass. It covers formatting, linting, strict TypeScript/Astro checks, translation parity, the production build, generated HTML, internal references, browser behavior, and automated accessibility checks.
- Manually review screenshots at 320, 768, and 1280 px in all three languages. Automated accessibility checks supplement rather than replace keyboard and visual review.
- Confirm the page has no console errors, overflow, broken anchors, missing assets, or inaccessible navigation with JavaScript disabled.
- Keep generated output, reports, screenshots, credentials, and editor files untracked. Summarize changed behavior and validation results at handoff.
