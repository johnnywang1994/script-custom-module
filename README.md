<p align="center">
  <a href="https://npmcharts.com/compare/script-custom-module?minimal=true"><img src="https://img.shields.io/npm/dm/script-custom-module.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/script-custom-module"><img src="https://img.shields.io/npm/v/script-custom-module.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.jsdelivr.com/package/npm/script-custom-module"><img src="https://data.jsdelivr.com/v1/package/npm/script-custom-module/badge" /></a>
  <a href="https://www.npmjs.com/package/script-custom-module"><img src="https://img.shields.io/npm/l/script-custom-module.svg?sanitize=true" alt="License"></a>
</p>

# Script Custom Module

A plugin written by Typescript to let developer compile ts,react,vue content in client side with native es module. No  bundler, just with one CDN and 4 lines configuration, and you are ready to use your favorite ES javascript to prototype your new idea.


## Install

### Template Setup
- Install this package as a global or local npm dependency
- create and serve a testing project with default setting
- open browser with url `http://localhost:1234`
```bash
# as global
$ npm install -g script-custom-module
$ create-scm
$ serve-scm
# or as local
$ npm install script-custom-module
$ npx create-scm
$ npx serve-scm
```


### Manual Setup
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
    entry: 'src/index.jsx',
    mode: 'all',
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


## Commands
### create-scm [-t|--template=TEMPLATE] [PROJECT_DIR]
create a new scm project with template
- TEMPLATE: `react`, `vue`, default is `react`
- PROJECT_DIR: project directory, default is `scm-project`

### serve-scm {[-p|--port=PORT] [-h|--host=HOST]} [PROJECT_DIR]
serve a folder with native Nodejs server by host and port
- PORT: port number, default is `1234`
- HOST: hostname, default is `localhost`
- PROJECT_DIR: project directory, default is `scm-project`


## APIs
In `window.CustomScript`, we can use following methods & states.

### setup(options)
the core method to initialize this plugin.

```js
const { Loaders } = CustomScript;

CustomScript.setup({
  // required, or provide <script type="root-module">
  entry: 'src/index.jsx',
  // default: ts
  // available: ts, react(react18), react17, vue(vue3), all(ts + react + vue)
  // each mode will auto inject necessary imports & scopes in import map
  mode: 'ts',
  // optional, the path will be added before all your dependency import except vue compiler path, default: ''
  publicPath: '',
  // optional, if you want to serve your own vue compiler path
  vueCompilerPath: 'https://cdn.jsdelivr.net/npm/script-custom-module/dist/vue-parser.mjs',
  // optional, put anything you want to manually use in your project
  // this importmap will got merged with those dependency parsed by your entry file
  importmap: {
    imports: {
      // optional, if you need to use some library as native es module
      // eg. styled-components
      'styled-components':
        'https://unpkg.com/@esm-bundle/styled-components/esm/styled-components.browser.min.js',
    },
    scopes: {}
  },
  // optional, if you want to give the dependency module as object without fetching
  // reference to below part "Sourcemap Mode"
  sourceMap: {},
  // optional, if you want to use your custom loader to compile files
  loaders: window.CustomScript.defaultLoaders,
});
```


## Compile feature

### Typescript/React Compile
By default, all the dependency end with extension `js`, `ts`, `jsx`, `tsx` will got compiled by `Babel`

### Scss/Css Compile
dependency end with extension `css`, `scss` will got compiled by `Sass`, and auto injected to `<head>`

### Vue Compile
dependency end with extension `vue` will got compiled by `@vue/compiler-sfc` plugin by esm, and auto generated `js`, `css` into `<head>` to load content.

### Yaml Compile
yaml files imported will be converted to json


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
    'src/snippet.html': '<div>Hello World</div>',
    'src/data.json': '{"status": 200}'
  },
});
</script>
```


### Root Module Entry
if the `entry` in options is not provided, CustomScript will search for `<script type="root-module">` as following

```html
<head>
  <!-- root-module -->
  <script type="root-module" src="src/index.js"></script>
</head>
<body>
  <div id="app"></div>

  <!-- or -->
  <script type="root-module">
    import { createApp } from 'vue';
    import App from 'src/App.vue';

    createApp(App).mount('#app');
  </script>
</body>
```


### Loader System - Custom Loader
If you want to compile your own file format, easily extend the `BasicLoader` class and define in your own.

```js
const { BasicLoader } = CustomScript;

class MyPHPLoader extends BasicLoader {
  static transform(url: string, rawContent?: string) {
    // This will request your file content where you import from
    const content = rawContent ? rawContent : super.requestFile(url);
    // handle your file content here
    const code = '...';
    return {
      code,
      moduleUrl: super.blob.createBlobUrl(code, 'text/javascript'),
    }
  }

  static compile(rawCode: string) {
    super.compileBase(rawCode, (filepath) => {
      // your own test regexp
      if (!/(\.php)$/i.test(filepath)) return;
      const { moduleUrl } = MyPHPLoader.transform(filepath);
      // write to dependency importmap
      super.writeModuleUrl(filepath, moduleUrl);
    });
  }
}
```

then put your custom Loader inside `setup` options

```js
CustomScript.setup({
  entry: 'src/index.jsx',
  loaders: [
    ...CustomScript.defaultLoaders,
    MyPHPLoader,
  ],
});
```



## Use Demos

For more use demos, please [refer here](https://github.com/johnnywang1994/custom-module/tree/master/test)


## Reference

This plugin is mainly inspired by [inline-module](https://www.npmjs.com/package/inline-module), just modified about the loader system.