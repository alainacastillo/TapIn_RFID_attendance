import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve('.');
const out = resolve(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const file of ['index.html', 'app.js', 'styles.css', '.nojekyll']) await cp(resolve(root, file), resolve(out, file));
console.log('TapIn static site built in dist/');
