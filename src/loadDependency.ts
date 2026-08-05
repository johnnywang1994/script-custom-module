import { loadScripts, createScript } from '@/utils/dom';

const deps = [
  'https://ga.jspm.io/npm:es-module-shims@2.7.0/dist/es-module-shims.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.jsdelivr.net/npm/babel-plugin-module-resolver-standalone@0.0.2/index.min.js',
  // 0.11.1 will remove css variable prefix "--"
  'https://cdn.jsdelivr.net/npm/sass.js@0.11.0/dist/sass.sync.min.js',
];

export default async function loadDependency() {
  return loadScripts(deps.map((src) => createScript({ src })));
}
