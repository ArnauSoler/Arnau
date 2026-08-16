import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fromRoot } from './lib.mjs';

const argumentsList = process.argv.slice(2);

function option(name, fallback) {
	const index = argumentsList.indexOf(name);
	return index >= 0 ? argumentsList[index + 1] : fallback;
}

const host = option('--host', '127.0.0.1');
const port = Number(option('--port', '4321'));
const dist = resolve(fromRoot('dist'));
const contentTypes = {
	'.css': 'text/css; charset=utf-8',
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml; charset=utf-8',
};

if (!existsSync(dist)) {
	console.error('No dist directory found. Run npm run build first.');
	process.exit(1);
}

const server = createServer((request, response) => {
	const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? host}`);
	const pathname = decodeURIComponent(requestUrl.pathname);
	let file = resolve(dist, `.${pathname}`);

	if (file !== dist && !file.startsWith(`${dist}${sep}`)) {
		response.writeHead(403).end('Forbidden');
		return;
	}

	if (pathname.endsWith('/') || (existsSync(file) && statSync(file).isDirectory())) {
		file = resolve(file, 'index.html');
	}

	if (!existsSync(file) || !statSync(file).isFile()) {
		response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
		return;
	}

	response.writeHead(200, {
		'Content-Type': contentTypes[extname(file)] ?? 'application/octet-stream',
	});
	createReadStream(file).pipe(response);
});

server.listen(port, host, () => {
	console.log(`Serving dist at http://${host}:${port}`);
});
