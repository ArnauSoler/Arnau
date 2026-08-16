import { readFileSync } from 'node:fs';
import { displayPath, fromRoot, isDirectory, walk } from './lib.mjs';

const rawArgs = process.argv.slice(2);
let scope = 'all';
const terms = [];

for (let index = 0; index < rawArgs.length; index += 1) {
	const argument = rawArgs[index];
	if (argument === '--scope') {
		scope = rawArgs[index + 1] ?? '';
		index += 1;
	} else if (argument.startsWith('--scope=')) {
		scope = argument.slice('--scope='.length);
	} else {
		terms.push(argument);
	}
}

const query = terms.join(' ').trim();
const scopes = {
	code: ['src', 'commands', 'tests'],
	content: ['src/i18n'],
	i18n: ['src/i18n'],
	styles: ['src/styles', 'STYLES.md'],
	all: ['src', 'commands', 'tests', 'README.md', 'AGENTS.md', 'STYLES.md'],
};

if (!query || !Object.hasOwn(scopes, scope)) {
	console.error('Usage: npm run find -- --scope <code|content|i18n|styles|all> <query>');
	process.exit(1);
}

const allowedExtensions = new Set(['.astro', '.css', '.js', '.json', '.md', '.mjs', '.ts']);
const files = scopes[scope].flatMap((entry) => {
	const absolute = fromRoot(...entry.split('/'));
	return isDirectory(absolute) ? walk(absolute, { extensions: allowedExtensions }) : [absolute];
});
const normalizedQuery = query.toLocaleLowerCase();
let matches = 0;

for (const file of [...new Set(files)].sort()) {
	const lines = readFileSync(file, 'utf8').split(/\r?\n/u);
	lines.forEach((line, index) => {
		if (line.toLocaleLowerCase().includes(normalizedQuery)) {
			console.log(`${displayPath(file)}:${index + 1}: ${line.trim()}`);
			matches += 1;
		}
	});
}

if (!matches) {
	console.error(`No ${scope} matches for “${query}”.`);
	process.exitCode = 1;
} else {
	console.log(`\n${matches} match${matches === 1 ? '' : 'es'}.`);
}
