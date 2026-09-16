import { cpSync, copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDirectory = join(rootDirectory, 'frontend', 'src');
const outputDirectory = join(rootDirectory, 'frontend', 'dist');

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });

const files = [
  'A_B.png',
  'index.html',
  'project.html',
  'project-contact.js',
  'project-page.css',
  'project-page.js',
  'script.js',
  'style.css'
];
const directories = ['commands'];

for (const file of files) copyFileSync(join(sourceDirectory, file), join(outputDirectory, file));
for (const directory of directories) cpSync(join(sourceDirectory, directory), join(outputDirectory, directory), { recursive: true });

console.log(`Frontend built in ${outputDirectory}`);