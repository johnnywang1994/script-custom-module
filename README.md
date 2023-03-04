# Script Custom Module

A plugin to let developer compile ts,react,vue content in client side with native es module. No  bundler, just with one CDN, and you are ready to use your favorite ES javascript to prototype your new idea.


## Install
Since this plugin is mainly used in client browser, simply install with CDN.

```html
<script src="https://cdn.jsdelivr.net/npm/script-custom-module/dist/custom-script.global.js"></script>
```


## Quick Usage

### Setup Custom Scripts
use the `setup` method to initialize from specific entrypoint file, then all dependency will got auto registered to the `importmap`, so that we can easily import our dependency by just calling native `import` method

```html
<!-- index.html -->
<head>
  <script>
  // initialize custom modules and create importmap
  CustomScript.setup({
    entry: 'src/index.js',
    vueCompilerPath: 'https://cdn.jsdelivr.net/npm/script-custom-module/dist/vue-parser.mjs',
    importmap: {
      imports: {
        // only vue compile required
        vue: 'https://unpkg.com/vue@3.2.41/dist/vue.esm-browser.js',
        '@vue/compiler-sfc': 'https://cdn.jsdelivr.net/npm/@vue/compiler-sfc@3.2.41/dist/compiler-sfc.esm-browser.js',
        // any other es module can be predefined here to use in your project
      },
      scopes: {}
    }
  });
  </script>
</head>
```

> Notice: `setup` will parse dependency from specific entrypoint, and loop into its dependencies.

```js
// entrypoint: index.js
import { createApp } from 'vue';
import App from 'src/App.vue';
import 'src/index.css';
import 'src/no.js';

createApp(App).mount('#app');
```

> Notice: since the path starts with `/`, `./` will be considered as native esm, please import dependency always from root with relative path liked `src/xxxx.js` or `xxxx.css` with file extension so that CustomScript can parse your file with correct process.

### Run up a local server to serve your static content
you can install [serve](https://www.npmjs.com/package/serve) or any other http service to run up a dev server for your folder.



## APIs
In `window.CustomScript`, we can use following methods & states.

### setup(options)
the core method to initialize this plugin.

```js
CustomScript.setup({
  entry: 'src/index.jsx', // required
  publicPath: '', // optional, the path will be added before all your dependency import except vue compiler path, default: ''
  // optional, only if you need to compile Vue SFC file
  vueCompilerPath: 'https://cdn.jsdelivr.net/npm/script-custom-module/dist/vue-parser.mjs',
  // put anything you want to manually use in your project
  // this importmap will got merged with those dependency parsed by your entry file
  importmap: {
    imports: {
      // react compile required
      react: 'https://unpkg.com/@esm-bundle/react/esm/react.development.js',
      'react-dom': 'https://unpkg.com/@esm-bundle/react-dom/esm/react-dom.development.js',
      'react-is': 'https://unpkg.com/@esm-bundle/react-is/esm/react-is.development.js',
      // optional, if you need styled-components
      'styled-components': 'https://unpkg.com/@esm-bundle/styled-components/esm/styled-components.browser.min.js',
      // vue compile required
      vue: 'https://unpkg.com/vue@3.2.41/dist/vue.esm-browser.js',
      '@vue/compiler-sfc': 'https://cdn.jsdelivr.net/npm/@vue/compiler-sfc@3.2.41/dist/compiler-sfc.esm-browser.js',
    },
    scopes: {}
  },
});
```


## Compile feature

### Typescript/React Compile
By default, all the dependency end with extension `js`, `ts`, `jsx`, `tsx` will got compiled by `Babel`

### Scss/Css Compile
dependency end with extension `css`, `scss` will got compiled by `Sass`, and auto injected to `<head>`

### Vue Compile
dependency end with extension `vue` will got compiled by `@vue/compiler-sfc` plugin by esm, and auto generated `js`, `css` into `<head>` to load content.

> need to give the `vueCompilerPath` to `setup` options so that Vue compile can be compiled correctly.

### Sourcemap Mode
with sourcemap mode, all dependency are injected by a user provided map object, and CustomScript will only process those rawCode you provided in map to generate compiled content to serve on browser.

```html
<!-- index.html -->
<script>
window.CustomScript.setup({
  // entry should also exists inside your sourceMap
  entry: 'src/index.js',
  sourceMap: {
    'src/index.js': 'import sum from "src/sum.js";\nconsole.log(sum(1, 2));',
    'src/sum.js': 'export default (a, b) => a + b;',
  },
});
</script>
```

> Not support html file in sourcemap


## Use Demos

For more use demos, please [refer here](https://github.com/johnnywang1994/custom-module/tree/master/test)

### Online Demo
try online demo [Here](https://www.maju-web.club/local), besides using normal editor, there are two special compile option you can use this tool.

Put following text to `html` block editor
- Vue3 SFC: `<!--inline-vue-->`
- Tsx: `<!--inline-js-->`

#### Vue Editor
you can use vue single file in the js editor by inputing `<!--inline-vue-->` in html editor, and the js editor will become the `main.js` for you.

```html
<!--inline-vue-->
<template>
  Count: {{ count }}
  <button class="btn" @click="addCount">ADD COUNT</button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref<number>(16);

const fontsize = computed(() => count.value + 'px');

const addCount = () => {
  count.value += 1;
}
</>

<style lang="scss" scoped>
.btn {
  color: red;
}
</style>

<style lang="scss">
.btn {
  font-size: v-bind(fontsize);
}
</style>
```


#### React Editor
you can use typescript or jsx in the js editor by inputing `<!--inline-js-->` in html editor

```html
<!--inline-js-->
<div id="app"></div>
```

```jsx
import React from 'react';
import { render } from 'react-dom';

function App() {
  return <div>Hello React</div>
}

render(<App />, document.getElementById('app'));
```


## Reference

This plugin is mainly inspired by [inline-module](https://www.npmjs.com/package/inline-module), just modified about the loader system.