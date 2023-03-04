// https://tsup.egoist.sh/
import { defineConfig } from 'tsup';

export default [defineConfig({
  entry: {
    'custom-script': 'src/index.ts',
  },
  dts: true,
  format: ['iife'],
  globalName: 'CustomScript',
  splitting: false,
  clean: true,
}), defineConfig({
  entry: ['src/vue-parser.ts'],
  format: ['esm'],
  splitting: false,
  clean: true,
})]