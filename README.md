# arnausoler.cat

A fast, accessible personal site for Arnau Soler, generated with Astro in English, Catalan, and Spanish. The production output is static and can be hosted by Plesk or any ordinary static web server.

## Local development

Requires Node.js 24 and npm.

```powershell
npm ci
npm run dev
```

Useful commands:

- `npm run inspect` prints a compact project, route, token, locale, and command map.
- `npm run find -- --scope i18n robotics` searches a focused part of the source tree.
- `npm run translations -- robotics` displays matching translation entries side by side.
- `npm run check:fast` runs the checks useful during editing.
- `npm run check` builds and fully validates the site.
- `npm run screenshots` captures all locales at the supported review widths.
- `npm run audit` runs Lighthouse budgets against the production build.

## Structure

```text
src/pages/          English and localized routes
src/components/     Shared page and navigation components
src/layouts/        Document metadata and HTML shell
src/i18n/           Typed English, Catalan, and Spanish copy
src/styles/         Design tokens and responsive styles
public/             Static assets copied into the build
commands/           Agent-friendly inspection and validation tools
tests/              Playwright behavior and accessibility checks
```

## Publish with Plesk

1. Run `npm ci` and `npm run check` locally or let GitHub Actions validate the same commit.
2. Run `npm run build`.
3. Open **Websites & Domains** for `arnausoler.cat`, then the domain's `httpdocs` folder.
4. Upload the **contents of `dist/`**, including locale folders and sitemap files. Do not upload `dist` itself.
5. Remove or rename any default Plesk `index.html` or `index.php` after confirming it is not needed.
6. Visit `/`, `/ca/`, and `/es/` in a private browser window and confirm assets, navigation, locale links, and external links load correctly.

The hosting control panel should keep HTTPS enabled. Astro server rendering, Node.js, PHP, and a database are not required in production.

## Adding content

Add shared UI as Astro components and localized copy in all three JSON files. New pages must provide localized routes, metadata, canonical and `hreflang` links, sitemap coverage, and automated tests. Do not publish contact details or professional claims that have not been supplied deliberately.
