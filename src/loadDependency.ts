import { loadScripts, createScript } from '@/utils/dom';

const deps = [
  'https://ga.jspm.io/npm:es-module-shims@1.6.2/dist/es-module-shims.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js',
];

export default async function loadDependency() {
  return loadScripts(deps.map((src) => createScript({ src })));
}