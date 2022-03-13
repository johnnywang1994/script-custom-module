# Custom Module

A plugin to let developer customize own esmodule type to use inline module or compile content in client side.


## Install
Since this plugin is mainly used in client browser, simply install with CDN.

```html
<script src="/custom-module-core.js"></script>
```


## Quick Usage
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
<script>
```


## Setup Custom Modules
We can import a custom module by calling `customImport`, but what if we need to use a bunch of custom modules

we can use the `setup` method to initialize all the custom modules, and register them to the `importmap`, so that we can easily import our custom modules by just calling native `import` method

```html
<script src="/custom-module-core.js"></script>
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

There are currently 5 default loaders can be used. we can access default loaders by `loaders`

- babel loader
- css loader
- sass loader
- react loader
- vue loader

```js
console.log(CustomModule.loaders);
```

### Babel Loader

to register a default loader, easily call the loader function before `setup`

> Babel Loader needs `@babel/standalone` be installed. By default it only uses with presets `env`.

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

### React Loader

react loader transform `jsx` using babel presets `react`, so we need `@babel/standalone` too.

the default react loader imports following plugins
- react
- react-dom
- react-is
- styled-components

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

and then init react app

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

