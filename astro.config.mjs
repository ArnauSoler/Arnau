import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://arnausoler.cat',
	output: 'static',
	trailingSlash: 'always',
	i18n: {
		locales: ['en', 'ca', 'es'],
		defaultLocale: 'en',
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [sitemap()],
});
