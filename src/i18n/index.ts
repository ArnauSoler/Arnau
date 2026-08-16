import ca from './ca.json';
import en from './en.json';
import es from './es.json';

export const locales = ['en', 'ca', 'es'] as const;
export type Locale = (typeof locales)[number];

export const localizedLocales = ['ca', 'es'] as const satisfies readonly Locale[];

export const pageKeys = ['home', 'software', 'competing', 'judging'] as const;
export type PageKey = (typeof pageKeys)[number];
export const detailPages = pageKeys.filter((page) => page !== 'home') as Exclude<PageKey, 'home'>[];

export const localeDetails = {
	en: { shortLabel: 'EN', nativeName: 'English', path: '/' },
	ca: { shortLabel: 'CA', nativeName: 'Català', path: '/ca/' },
	es: { shortLabel: 'ES', nativeName: 'Español', path: '/es/' },
} as const satisfies Record<Locale, { shortLabel: string; nativeName: string; path: string }>;

export const translations = {
	en,
	ca,
	es,
} satisfies Record<Locale, typeof en>;

export type Translation = (typeof translations)[Locale];

export function isLocale(value: string | undefined): value is Locale {
	return locales.includes(value as Locale);
}

export function isDetailPage(value: string | undefined): value is Exclude<PageKey, 'home'> {
	return detailPages.includes(value as Exclude<PageKey, 'home'>);
}

export function pagePath(locale: Locale, page: PageKey): string {
	const prefix = localeDetails[locale].path;
	return page === 'home' ? prefix : `${prefix}${page}/`;
}

export function getTranslation(locale: Locale): Translation {
	return translations[locale];
}
