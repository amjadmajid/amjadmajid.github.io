import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
await mkdir(output, { recursive: true });
for (const item of ['index.html', 'assets', 'data', '.nojekyll']) {
  await cp(path.join(root, item), path.join(output, item), { recursive: true });
}
console.log('Static site prepared in dist/. No dependencies required.');
