import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fromRoot, readJson } from './lib.mjs';

function packageBin(packageName, binName) {
	const packageDirectory = fromRoot('node_modules', ...packageName.split('/'));
	const manifest = readJson(join(packageDirectory, 'package.json'));
	const bin = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin[binName];
	return join(packageDirectory, bin);
}

function run(bin, args, environment = process.env) {
	const result = spawnSync(process.execPath, [bin, ...args], {
		stdio: 'inherit',
		env: environment,
	});
	if (result.error) throw result.error;
	if (result.status !== 0) process.exit(result.status ?? 1);
}

run(packageBin('astro', 'astro'), ['build']);
run(packageBin('@playwright/test', 'playwright'), ['test', '--grep', '@screenshots'], {
	...process.env,
	CAPTURE_SCREENSHOTS: '1',
});
