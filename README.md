# Script Custom Module

A plugin to let developer customize own script es module type to use custom module or compile content in client side.


## Install
Since this plugin is mainly used in client browser, simply install with CDN.

```html
<script src="https://cdn.jsdelivr.net/npm/script-custom-module/dist/custom-module-core.min.js"></script>
```


## Quick Usage

### Local
Define your custom module by giving it an `id`.

```html
<script src="/custom-module-core.js"></script>
<script type="custom-module" id="foo">
  export default {
    foo: 'hello'
  }
</script>
```

then we can use the module by calling window event `customImport` as following in real script module

```html
<script type="module">
// this will call the dynamic `import` method in esmodule
const foo = (await customImport('foo')).default;
console.log(foo);
</script>
```

### Online
or try the online demo [Here](https://www.maju-web.club/local), besides using normal editor, there are two special compile option you can use this tool.

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



## Setup Custom Modules
We can import a custom module by calling `customImport`, but what if we need to use a bunch of custom modules

we can use the `setup` method to initialize all the custom modules, and register them to the `importmap`, so that we can easily import our custom modules by just calling native `import` method

```html
<script src="/custom-module-core.js"></scrip>
<script type="custom-module" id="foo">
  export default {
    foo: 'hello foo'
  }
</script>
<script type="custom-module" id="bar">
  export default {
    bar: 'hello bar'
  }
</script>
<script>
  // initialize custom modules and create importmap
  CustomModule.setup();
</script>
```

```html
<script type="module">
import foo from 'foo';
import bar from 'bar';
console.log(bar);
<script>
```

> Notice: because `setup` will parse every custom modules before it, and create the importmap, any `import` before `setup` will cause error.


## External Importmap

Since native `importmap` could only exist 1 block in a document, if we need to customize the importmap outside we can use the `custom-module-importmap`.

This json value will be merged with auto generated `importmap`

```html
<script src="custom-module-core.js"></script>
<script type="custom-module-importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>
<script type="custom-module" id="foo">
  export default {
    foo: 'hello foo'
  }
</script>
<script>
  CustomModule.setup();
</script>
```

```html
<script type="module">
import { createApp } from 'vue';
import foo from 'foo';
console.log(createApp, foo);
</script>
```

the merged `importmap` will be like

```json
{
  "imports": {
    "vue":
      "https://unpkg.com/vue@3/dist/vue.esm-browser.js",
    "foo":
      "blob:http://localhost:5000/1b000310-6732-4c48-8f48-550b57492152"
  },
  "scopes": {}
}
```


## Compile Loaders

We can compile the content of our custom modules by giving it `loader` attribute, and define the loader by `defineLoader` method

### Define a Loader

```js
// my-loader.js
CustomModule.defineLoader({
  name: 'myloader',
  // setup will be triggered same time with calling `setup` method
  setup() {
    console.log('my-loader setup!');
  },
  // transform will be called everytime the file being imported
  transform({ code }) {
    console.log('my-loader transform content here!');
    // remember to return a valid `text/javascript` content
    return code;
  },
  // we can add some dependencies for our loaders
  // imports will be merged to global `importmap` the same time loader being defined
  imports: {},
});
```

### Use a Loader

```html
<script src="/custom-module-core.js"></script>
<script src="/my-loader.js"></script>
<script type="custom-module" id="foo" loader="myloader">
export default {
  foo: 'hello foo'
}
</script>
<script>
  CustomModule.setup();
  // my-loader setup!
  // my-loader transform content here!
</script>
```

## Built-in Loader

There are currently 5 default loaders can be used. we can access default loaders by `loaders`, you can find out the [default loaders here](https://github.com/johnnywang1994/custom-module/tree/master/src/loaders)

- babel loader
- css loader
- sass loader
- react loader
- vue loader
- ts loader

```js
console.log(CustomModule.loaders);
```

### Babel Loader

to register a default loader, easily call the loader function before `setup`

> Babel Loader needs `@babel/standalone` be installed. By default it only uses with presets `env` with plugins `proposal-decorators`, `proposal-class-properties`.

```html
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script src="/custom-module-core.js"></script>
<script type="custom-module" id="foo" loader="babel">
const needBabel = (a, b) => {
  return a + b;
};
export default needBabel;
</script>
<script>
  CustomModule.loaders.BabelLoader();
  CustomModule.setup();
</script>
```

the loader will transform the module as following

```html
<script type="module">
import foo from 'foo';

console.log(foo);
// function needBabel(a, b) {
//   return a + b;
// }
</script>
```

> When using babel loader in ESModule, because the babel will transform the content into commonjs which is not compatible in browser, the loader will auto regenerate `export` syntax to fix the problem. but basically not recommend to use the `babel loader` in client, if you need to compile `jsx`, easily use the `react loader` instead.


### Typescript Loader

`typescript loader` transform `typescript` syntax by preset `babel-typescript`, the same plugin with `babel loader`.


### React Loader

react loader transform `jsx` using babel presets `react`, so we need `@babel/standalone` too.

the default react loader imports following plugins
- react
- react-dom
- react-is
- styled-components

1. Register our react components with `id`

if you need typescript, just put `typescript` before `react` as

```html
<script type="custom-module" id="@/App.jsx" loader="typescript react"></script>
```

```html
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script src="/custom-module-core.js"></script>
<script type="custom-module" id="@/App.jsx" loader="react">
import React from 'react'
import styled from 'styled-components'

const ContainerDiv = styled.div`
  width: 600px;
  margin: auto;
  color: blue;
`;

function App() {
  return (
    <ContainerDiv>
      Hello World
    </ContainerDiv>
  )
}

export default App;
</script>
<script>
  CustomModule.loaders.BabelLoader();
  CustomModule.setup();
</script>
```

2. Init out react app

```html
<div id="app"></div>

<script type="module">
import { createElement } from 'react'
import { render } from 'react-dom'
import App from '@/App.jsx'

render(
  createElement(App),
  document.getElementById('app')
);
</script>
```


### Css/Sass Loader

`css loader`, `sass loader` transforms `css`, `scss`, `sass` file into blobUrl and use `<link>` tag to inject them into document once we `import`.

Remember to import the `sass.js` plugin when using `sass loader`.

```html
<script src="https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js"></script>
<script type="custom-module" id="@/index.scss" src="index.scss" loader="sass"></script>
<script src="custom-module-core.js"></script>
<script>
  CustomModule.loaders.SassLoader();
  CustomModule.setup();
</script>
```

then we can start using css in our client

```html
<script type="module">
// import a css file will inject the styles into document
// no import, no inject
import indexScss from '@/index.scss';

console.log(indexScss);
</script>
```

> if your custom module has `mount` attribute on it, it'll be auto inject after setup

```html
<script type="custom-module" id="@/index.scss" src="index.scss" loader="sass" mount></script>
```


### Vue Loader

`vue loader` uses `@vue/compiler-sfc` to compile your Vue SFC file into pure render function and scripts, the css part will use `css loader`, `sass loader` to handle.

1. Register our components inline

```html
<script src="https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js"></script>
<script type="custom-module" id="@/App.vue" src="App.vue" loader="vue"></script>
<script src="custom-module-core.js"></script>
<script>
  CustomModule.loaders.SassLoader();
  CustomModule.loaders.VueLoader();
  CustomModule.setup();
</script>
```

2. Use our registered components in esmodules

```html
<div id="app"></div>

<script type="module">
import { createApp } from 'vue'
import App from '@/App.vue'

createApp(App).mount('#app')
</script>
```

> Due to the limitation of `postcss-modules`, its not currently possible to compile `css modules` in client side, so `css modules` feature for SFC are not compatible with this plugin. But `scoped` feature works just fine.


## APIs

In `window.CustomModule`, we can use following methods & states.

### setup(options)
the core method to initialize this plugin, remember to call it after all your custom modules settings.

```js
CustomModule.setup({
  // default shim for importmap, if you do not need shim for this, just pass empty for this option ''
  esmShimUrl: 'https://ga.jspm.io/npm:es-module-shims@1.4.6/dist/es-module-shims.js',
  // moduleType for CustomModule handle, you can name whatever you want
  // default: custom-module
  moduleType: 'custom-module',
  loaders: {
    // key in loaders refer from specific loader name
    // you can pass your custom options into your loader here
    css: {},
    sass: {},
    react: {},
  }
});
```

> If your using `custom-module` in your iframe, the default `esmShimUrl` will cause error, just give it empty value will remove the `cross-origin` error.

### defineLoader(loader)

A valid loader would contains
- name: `string`(required)
- setup: `function`(optional)
- transform: `function`(required)
- imports: `importmap json`(optional)

### registerDefault()

`registerDefault` will register all default loaders, please include both `@babel/standalone` & `sass.js` before calling this method.

### loaders

containers for default loaders, you can also call `registerDefault` by loaders

### importmap

the final generated importmap json



## Use Demos

For more use demos, please [refer here](https://github.com/johnnywang1994/custom-module/tree/master/test)


## Reference

This plugin is mainly inspired by [inline-module](https://www.npmjs.com/package/inline-module), just modified about the loader system.