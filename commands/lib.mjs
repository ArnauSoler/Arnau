import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
export const localeCodes = ['en', 'ca', 'es'];

export function fromRoot(...parts) {
	return join(root, ...parts);
}

export function readJson(path) {
	return JSON.parse(readFileSync(path, 'utf8'));
}

export function readLocales() {
	return Object.fromEntries(
		localeCodes.map((locale) => [locale, readJson(fromRoot('src', 'i18n', `${locale}.json`))]),
	);
}

export function flattenStrings(value, prefix = '') {
	return Object.entries(value).flatMap(([key, entry]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		return typeof entry === 'string' ? [[path, entry]] : flattenStrings(entry, path);
	});
}

export function walk(directory, options = {}) {
	const { extensions, exclude = new Set() } = options;
	const files = [];

	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		if (exclude.has(entry.name)) continue;
		const absolute = join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...walk(absolute, options));
		} else if (!extensions || extensions.has(extname(entry.name))) {
			files.push(absolute);
		}
	}

	return files;
}

export function displayPath(path) {
	return relative(root, path).replaceAll('\\', '/');
}

export function isDirectory(path) {
	try {
		return statSync(path).isDirectory();
	} catch {
		return false;
	}
}
