import { readFileSync } from 'node:fs';
import { displayPath, flattenStrings, fromRoot, readJson, readLocales, walk } from './lib.mjs';

const packageJson = readJson(fromRoot('package.json'));
const routes = walk(fromRoot('src', 'pages'), { extensions: new Set(['.astro']) }).map(displayPath);
const components = walk(fromRoot('src', 'components'), { extensions: new Set(['.astro']) }).map(
	displayPath,
);
const assets = walk(fromRoot('public')).map(displayPath);
const css = readFileSync(fromRoot('src', 'styles', 'global.css'), 'utf8');
const tokens = [...css.matchAll(/--([a-z][a-z0-9-]+)\s*:/gu)].map((match) => `--${match[1]}`);
const translations = readLocales();

console.log('arnausoler.cat project map');
console.log(`Runtime: Node ${packageJson.engines.node}; Astro static output; npm lockfile`);
console.log('Public routes: / (en), /ca/ (ca), /es/ (es)');
console.log(`Route sources (${routes.length}): ${routes.join(', ')}`);
console.log(`Components (${components.length}): ${components.join(', ')}`);
console.log(`Public assets (${assets.length}): ${assets.join(', ')}`);
console.log(`CSS tokens (${tokens.length}): ${tokens.join(', ')}`);
console.log(
	`Translations: ${Object.entries(translations)
		.map(([locale, value]) => `${locale}=${flattenStrings(value).length}`)
		.join(', ')}`,
);
console.log('Commands:');
for (const [name, command] of Object.entries(packageJson.scripts))
	console.log(`  npm run ${name}: ${command}`);
