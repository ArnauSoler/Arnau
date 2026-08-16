import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const locales = [
	{ code: 'en', prefix: '' },
	{ code: 'ca', prefix: '/ca' },
	{ code: 'es', prefix: '/es' },
] as const;

const pages = ['home', 'software', 'competing', 'judging'] as const;

function pathFor(prefix: string, section: (typeof pages)[number]) {
	return section === 'home' ? (prefix ? prefix + '/' : '/') : prefix + '/' + section + '/';
}

for (const locale of locales) {
	for (const section of pages) {
		const path = pathFor(locale.prefix, section);
		test(
			locale.code + ' ' + section + ' route has localized metadata and complete navigation',
			async ({ page }) => {
				const consoleErrors: string[] = [];
				page.on('console', (message) => {
					if (message.type() === 'error') consoleErrors.push(message.text());
				});
				page.on('pageerror', (error) => consoleErrors.push(error.message));

				await page.goto(path);
				await expect(page.locator('html')).toHaveAttribute('lang', locale.code);
				await expect(page).toHaveTitle(/Arnau Soler/u);
				await expect(page.locator('meta[name="description"]')).toHaveAttribute(
					'content',
					/.+/u,
				);
				await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
				await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
					'href',
					'https://arnausoler.cat' + path,
				);
				await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(4);
				await expect(
					page.locator('.language-selector [aria-current="page"]'),
				).toHaveAttribute('hreflang', locale.code);
				await expect(
					page.locator('.desktop-navigation a[aria-current="page"]'),
				).toHaveCount(1);

				const duplicateIds = await page.locator('[id]').evaluateAll((elements) => {
					const ids = elements.map((element) => element.id);
					return ids.filter((id, index) => ids.indexOf(id) !== index);
				});
				expect(duplicateIds).toEqual([]);

				const invalidExternalLinks = await page
					.locator('a[target="_blank"]')
					.evaluateAll((links) =>
						links
							.filter(
								(link) =>
									!(link as HTMLAnchorElement).rel
										.split(/\s+/u)
										.includes('noreferrer'),
							)
							.map((link) => link.getAttribute('href')),
					);
				expect(invalidExternalLinks).toEqual([]);
				expect(consoleErrors).toEqual([]);
			},
		);

		test(
			locale.code +
				' ' +
				section +
				' route has no automatically detectable WCAG A or AA violations',
			async ({ page }) => {
				await page.goto(path);
				const results = await new AxeBuilder({ page })
					.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
					.analyze();
				expect(results.violations).toEqual([]);
			},
		);
	}
}

test('keyboard and native mobile navigation work', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 800 });
	await page.goto('/judging/');
	await page.keyboard.press('Tab');
	await expect(page.locator('.skip-link')).toBeFocused();
	await page.locator('.navigation-menu > summary').click();
	await expect(page.locator('.navigation-menu')).toHaveAttribute('open', '');
	await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Participations' })).toHaveAttribute(
		'href',
		'/competing/',
	);
});

test('essential content and navigation work without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 320, height: 800 },
	});
	const page = await context.newPage();
	await page.goto('/ca/competing/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
	await page.locator('.navigation-menu > summary').click();
	await expect(page.getByRole('navigation', { name: 'Navegació mòbil' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'ES' })).toHaveAttribute('href', '/es/competing/');
	await context.close();
});

test('masthead titles use the intended desktop line breaks', async ({ page }) => {
	await page.setViewportSize({ width: 1024, height: 900 });

	const lineCount = async (path: string) => {
		await page.goto(path);
		return page.locator('h1').evaluate((heading) => {
			const range = document.createRange();
			range.selectNodeContents(heading);
			return range.getClientRects().length;
		});
	};

	expect(await lineCount('/ca/judging/')).toBe(1);
	expect(await lineCount('/')).toBeLessThanOrEqual(2);
	expect(await lineCount('/ca/')).toBeLessThanOrEqual(2);
	expect(await lineCount('/es/')).toBeLessThanOrEqual(2);
});

for (const width of [320, 768, 1280]) {
	test('all localized routes fit a ' + width + 'px viewport', async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		for (const locale of locales) {
			for (const section of pages) {
				await page.goto(pathFor(locale.prefix, section));
				const overflow = await page.evaluate(
					() =>
						document.documentElement.scrollWidth - document.documentElement.clientWidth,
				);
				expect(overflow).toBeLessThanOrEqual(1);
			}
		}
	});
}

test('@screenshots capture localized review artifacts', async ({ page }) => {
	test.skip(process.env.CAPTURE_SCREENSHOTS !== '1', 'Run with npm run screenshots.');
	for (const width of [320, 768, 1280]) {
		await page.setViewportSize({ width, height: 900 });
		for (const locale of locales) {
			for (const section of pages) {
				await page.goto(pathFor(locale.prefix, section));
				await page.screenshot({
					path:
						'artifacts/screenshots/' +
						locale.code +
						'-' +
						section +
						'-' +
						width +
						'.png',
					fullPage: true,
				});
			}
		}
	}
});
