import { readFileSync } from 'node:fs';
import { displayPath, fromRoot, walk } from './lib.mjs';

const dist = fromRoot('dist');
const files = walk(dist, { extensions: new Set(['.html']) });
let errors = 0;

if (!files.length) {
	console.error('No generated HTML found. Run npm run build first.');
	process.exit(1);
}

for (const file of files) {
	const response = await fetch('https://validator.w3.org/nu/?out=json', {
		method: 'POST',
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'User-Agent': 'arnausoler.cat validation command',
		},
		body: readFileSync(file),
	});

	if (!response.ok) throw new Error(`W3C validator returned HTTP ${response.status}`);
	const result = await response.json();
	const failures = result.messages.filter((message) => message.type === 'error');
	console.log(`${displayPath(file)}: ${failures.length} error(s)`);
	for (const failure of failures)
		console.error(`  line ${failure.lastLine ?? '?'}: ${failure.message}`);
	errors += failures.length;
}

if (errors) process.exitCode = 1;
