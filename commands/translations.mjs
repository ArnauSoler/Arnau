import { flattenStrings, localeCodes, readLocales } from './lib.mjs';

const query = process.argv.slice(2).join(' ').trim().toLocaleLowerCase();
const translations = readLocales();
const values = Object.fromEntries(
	localeCodes.map((locale) => [locale, new Map(flattenStrings(translations[locale]))]),
);
const keys = [...values.en.keys()].filter((key) => {
	if (!query) return true;
	return (
		key.toLocaleLowerCase().includes(query) ||
		localeCodes.some((locale) => values[locale].get(key)?.toLocaleLowerCase().includes(query))
	);
});

if (!keys.length) {
	console.error(`No translation key or value matched “${query}”.`);
	process.exitCode = 1;
} else {
	for (const key of keys) {
		console.log(key);
		for (const locale of localeCodes) console.log(`  ${locale}: ${values[locale].get(key)}`);
	}
}
