# Script Custom Module

A plugin to let developer customize own script es module type to use custom module or compile content in client side.


## Install
Since this plugin is mainly used in client browser, simply install with CDN.

```html
<script src="https://cdn.jsdelivr.net/npm/script-custom-module/dist/custom-script.global.js"></script>
```


## Quick Usage

### Setup Custom Scripts
we can use the `setup` method to initialize from specific entrypoint file, then all dependency will got auto registered to the `importmap`, so that we can easily import our dependency by just calling native `import` method

```html
<script>
// initialize custom modules and create importmap
CustomScript.setup({
  entry: 'src/index.js',
});
</script>
```

> Notice: `setup` will parse every from entrypoint, and loop into its dependencies.

### Run up a local server to serve your static content
you can install [serve](https://www.npmjs.com/package/serve) or any other http service to run up a dev server for your folder.



## APIs
In `window.CustomScript`, we can use following methods & states.

### setup(options)
the core method to initialize this plugin, remember to call it after all your custom modules settings.

```js
CustomScript.setup({
  entry: 'src/index.jsx', // required
  publicPath: '', // optional, default: ''
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

> If your using `custom-module` in your iframe, the default `esmShimUrl` will cause error, just give it empty value will remove the `cross-origin` error.



## Compile feature

### Typescript/React Compile
By default, all the dependency end with extension `js`, `ts`, `jsx`, `tsx` will got compiled by `Babel`

### Scss/Css Compile
dependency end with extension `css`, `scss` will got compiled by `Sass`, and auto injected to `<head>`

### Vue Compile
dependency end with extension `vue` will got compiled by `@vue/compiler-sfc` plugin by esm, and auto generated `js`, `css` into `<head>` to load content.

> need to give the `vueCompilerPath` to `setup` options so that Vue compile can be compiled correctly.

### Sourcemap Mode
waiting to update, to be continue...



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