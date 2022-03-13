import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve'; // allocate modules
import commonjs from '@rollup/plugin-commonjs'; // convert cjs to es6 module
import { terser } from "rollup-plugin-terser";

const isProd = process.env.NODE_ENV === 'production';

const config = defineConfig({
  input: 'src/index.js',
  output: {
    name: 'CustomModule',
    file: `dist/custom-module-core${isProd ? '.min' : ''}.js`,
    format: 'umd',
    exports: 'default',
    // @rollup/plugin-typescript 'sourcemap' option warning
    sourcemap: !isProd,
    compact: isProd
  },
  plugins: [
    nodeResolve(),
    (isProd && terser()),
    commonjs()
  ],
});

export default config;
