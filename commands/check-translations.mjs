import { readFileSync } from 'node:fs';
import { displayPath, flattenStrings, fromRoot, localeCodes, readLocales, walk } from './lib.mjs';

const translations = readLocales();
const baseEntries = new Map(flattenStrings(translations.en));
const baseKeys = [...baseEntries.keys()].sort();
const failures = [];

for (const locale of localeCodes) {
	const entries = new Map(flattenStrings(translations[locale]));
	const keys = [...entries.keys()].sort();
	const missing = baseKeys.filter((key) => !entries.has(key));
	const extra = keys.filter((key) => !baseEntries.has(key));

	if (missing.length) failures.push(`${locale}: missing keys: ${missing.join(', ')}`);
	if (extra.length) failures.push(`${locale}: extra keys: ${extra.join(', ')}`);

	for (const [key, value] of entries) {
		if (!value.trim()) failures.push(`${locale}.${key}: value is empty`);
		if (/[<>]/u.test(value))
			failures.push(`${locale}.${key}: translations must not contain HTML`);
	}
}

const componentFiles = walk(fromRoot('src'), {
	extensions: new Set(['.astro', '.ts']),
});
const source = componentFiles.map((path) => readFileSync(path, 'utf8')).join('\n');
const unused = baseKeys.filter((key) => {
	const parts = key.split('.');
	return !parts.some((_, index) => {
		const access = parts.slice(0, index + 1).join('.');
		return source.includes(`copy.${access}`) || source.includes(access);
	});
});

if (unused.length) failures.push(`Unused translation keys: ${unused.join(', ')}`);

if (failures.length) {
	console.error('Translation validation failed:\n');
	for (const failure of failures) console.error(`- ${failure}`);
	process.exitCode = 1;
} else {
	console.log(
		`Translations OK: ${localeCodes.length} locales × ${baseKeys.length} plain-text values (${displayPath(fromRoot('src', 'i18n'))}).`,
	);
}
