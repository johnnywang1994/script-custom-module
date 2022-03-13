(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CustomModule = factory());
})(this, (function () { 'use strict';

  function insertBefore(target, el) {
    target.insertAdjacentElement('beforebegin', el);
  }

  function insertAfter(target, el) {
    target.insertAdjacentElement('afterend', el);
  }

  function loadContent(url) {
    const request = new XMLHttpRequest();
    request.open('GET', url, false); // `false` makes the request synchronous
    request.send(null);

    if(request.status === 200) {
      return request.responseText;
    }
    throw new Error(request.statusText);
  }

  function createBlob(code, type = 'text/plain') {
    const blob = new Blob([code], { type });
    return URL.createObjectURL(blob);
  }

  // modify from koa-compose
  function loaderCompose(loaders) {
    return function(context, options) {
      let index = -1;
      return dispatch(0);

      async function dispatch(i) {
        if (i <= index) return Promise.reject(new Error('called multiple times'));
        index = i;
        let fn = loaders[i];
        if (!fn) return Promise.resolve();
        try {
          context.code = await Promise.resolve(fn(context, options));
          return dispatch.call(null, i + 1)
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
  }

  function BabelLoader() {
    CustomModule.defineLoader({
      name: 'babel',
      setup() {
        if (!window.Babel) {
          console.warn('please install "https://unpkg.com/@babel/standalone/babel.min.js" to use babel.');
        }
      },
      transform({ code }, { loaderOptions = {} }) {
        if (!window.Babel) return code;
        const { transform } = Babel;
        loaderOptions.babel = loaderOptions.babel || { presets: ['env'] };
        const { code: resolvedCode } = transform(code, loaderOptions.babel);
        if (loaderOptions.babel.presets.includes('env')) {
          return `
const exports = {};

${resolvedCode.replace(/exports\.{1}(.*)\s+/g, 'export let $1 ')};

export default exports['default'];
        `;
        }
        return resolvedCode;
      },
    });
  }

  function CssLoader$1() {
    window.__custom_css_cache__ = window.__custom_css_cache__ || {};

    CustomModule.defineLoader({
      name: 'css',
      setup() {
        window.__custom_css_loader__ = (code, uid) => {
          if (!__custom_css_cache__[uid]) {
            const href = __custom_css_cache__[uid] = createBlob(code, 'text/css');
            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', href);
            document.head.appendChild(link);
          }
        };

        function createBlob(code, type = 'text/plain') {
          const blob = new Blob([code], { type });
          return URL.createObjectURL(blob);
        }
      },
      transform({ code, uid }) {
        return `
const code = \`${code}\`;

window.__custom_css_loader__(code, "${uid}");

export default code;
      `;
      },
    });
  }

  function CssLoader() {
    CustomModule.defineLoader({
      name: 'react',
      setup() {
        if (!window.Babel) {
          console.warn('please install "https://unpkg.com/@babel/standalone/babel.min.js" to use react.');
        }
      },
      transform({ code }) {
        if (!window.Babel) return code;
        const { transform } = Babel;
        const { code: resolvedCode } = transform(code, {
          presets: ['react'],
        });
        return resolvedCode;
      },
      imports: {
        react: 'https://unpkg.com/@esm-bundle/react/esm/react.development.js',
        'react-dom': 'https://unpkg.com/@esm-bundle/react-dom/esm/react-dom.development.js',
        'react-is': 'https://unpkg.com/@esm-bundle/react-is/esm/react-is.development.js',
        'styled-components': 'https://unpkg.com/@esm-bundle/styled-components/esm/styled-components.browser.min.js'
      }
    });
  }

  function SassLoader() {
    window.__custom_css_cache__ = window.__custom_css_cache__ || {};

    CustomModule.defineLoader({
      name: 'sass',
      setup() {
        window.__custom_sass_loader__ = (code, uid, opts) => {
          if (!__custom_css_cache__[uid]) {
            if (window.Sass) {
              Sass.compile(code, opts, function(css) {
                const href = __custom_css_cache__[uid] = createBlob(css.text, 'text/css');
                const link = document.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('href', href);
                document.head.appendChild(link);
              });
            } else {
              console.warn('please install "https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js" to compile sass file.');
            }
          }
        };

        function createBlob(code, type = 'text/plain') {
          const blob = new Blob([code], { type });
          return URL.createObjectURL(blob);
        }
      },
      transform({ code, uid, filename }, { loaderOptions = {} }) {
        const options = {
          indentedSyntax: false,
          ...(loaderOptions.sass || {}),
        };
        if (filename.endsWith('.sass')) options.indentedSyntax = true;
        else if (filename.endsWith('.scss')) options.indentedSyntax = false;

        return `
const code = \`${code}\`;
const options = ${JSON.stringify(options, null , 2)};

window.__custom_sass_loader__(code, "${uid}", options);

export default code;
      `;
      },
    });
  }

  function VueLoader() {
    window.__custom_vue_cache__ = {};

    CustomModule.defineLoader({
      name: 'vue',
      setup() {
        window.__custom_vue_loader__ = (compiler, { code, uid, filepath }) => {
          if (!__custom_vue_cache__[uid]) {
            const { parse, compileScript, compileTemplate, compileStyleAsync } = compiler;

            // parse code by atob(to safely transform string content)
            const { descriptor } = parse(window.atob(code), {
              filename: filepath
            });
            // console.log(descriptor);

            // compile script
            const { content: scriptCode } = compileScript(descriptor, {
              id: uid,
            });

            // parse styles with scoped check
            let hasCssModules = false;
            let hasScoped = false;
            descriptor.styles.forEach(({ attrs, content, scoped, module }) => {
              // TODO: css module support
              if (module) hasCssModules = true;
              if (scoped) hasScoped = true;
              compileStyleAsync({
                source: content,
                id: `data-v-${uid}`,
                filename: filepath,
                scoped,
                trim: true,
              }).then(({ code: styleCode }) => {
                injectStyle(styleCode, uid, attrs.lang);
              });
            });

            // parse template
            let templateCode = '';
            if (descriptor.template) {
              const { code: template } = compileTemplate({
                id: uid,
                filename: filepath,
                source: descriptor.template.content,
                scoped: hasScoped,
                slotted: descriptor.slotted,
                compilerOptions: {
                  scopeId: hasScoped ? `data-v-${uid}` : null,
                }
              });
              templateCode = template;
            }

            // cache result
            __custom_vue_cache__[uid] = {
              template: createBlob(templateCode, 'text/javascript'),
              script: createBlob(scriptCode, 'text/javascript'),
              scoped: hasScoped,
              cssModules: hasCssModules,
            };
          }
        };

        function injectStyle(content, uid, lang) {
          if (['sass', 'scss'].includes(lang)) {
            if (isFn(window.__custom_sass_loader__)) {
              window.__custom_sass_loader__(content, uid, {
                indentedSyntax: lang === 'sass',
              });
            } else {
              console.warn('Please install custom-sass-loader to compile SFC styles');
            }
          } else if (isFn(window.__custom_css_loader__)) {
            window.__custom_css_loader__(content, uid);
          } else {
            console.warn('Please install custom-css-loader to compile SFC styles');
          }
        }

        function createBlob(code, type = 'text/plain') {
          const blob = new Blob([code], { type });
          return URL.createObjectURL(blob);
        }

        function isFn(v) {
          return typeof v === 'function';
        }
      },
      transform({ code, uid, filepath, filename }) {
        const options = {
          code: window.btoa(code),
          uid,
          filepath,
          filename,
        };
        const result = `
import {
  parse,
  compileScript,
  compileTemplate,
  compileStyleAsync
} from '@vue/compiler-sfc';

const uid = "${uid}";
const compiler = {
  parse,
  compileScript,
  compileTemplate,
  compileStyleAsync
};

window.__custom_vue_loader__(compiler, ${JSON.stringify(options)});

const script = (await import(__custom_vue_cache__[uid].script)).default;

if (__custom_vue_cache__[uid].template) {
  const { render } = (await import(__custom_vue_cache__[uid].template));
  script.render = render;
}

if (__custom_vue_cache__[uid].scoped) script.__scopeId = \`data-v-${uid}\`;

// TODO: css module support
if (__custom_vue_cache__[uid].cssModules) {
  script.__cssModules = {}
}

export default script;
      `;

        return result;
      },
      imports: {
        vue: 'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
        '@vue/compiler-sfc': 'https://cdn.jsdelivr.net/npm/@vue/compiler-sfc@3/dist/compiler-sfc.esm-browser.js',
      }
    });
  }

  function registerDefault() {
    BabelLoader();
    CssLoader();
    CssLoader$1();
    SassLoader();
    VueLoader();
  }

  var Loaders = {
    BabelLoader,
    CssLoader: CssLoader$1,
    ReactLoader: CssLoader,
    SassLoader,
    VueLoader,
    registerDefault,
  };

  /*  */

  const currentScript = document.currentScript || document.querySelector('script');

  // https://github.com/WICG/import-maps
  const map = { imports: {}, scopes: {} }; // global importmap
  const loaderMap = {}; // registered loaders
  const mountList = []; // module id need to mount
  const installed = new Set(); // installed module url
  let activeOptions = {};

  // https://github.com/guybedford/es-module-shims
  function loadEsmShim(shimUrl) {
    const esmShim = document.createElement('script');
    esmShim.setAttribute('async', true);
    esmShim.setAttribute('src', shimUrl);
    insertBefore(currentScript, esmShim);
  }

  async function setupLoaders() {
    const promises = [];
    Object.keys(loaderMap).forEach((name) => {
      const loader = loaderMap[name];
      if (typeof loader.setup === 'function') {
        const p = Promise.resolve(loader.setup());
        promises.push(p);
      }
    });
    await Promise.all(promises);
  }

  function createContext(moduleEl, code) {
    const filepath = moduleEl.getAttribute('src') || '';
    return {
      code,
      filepath,
      // prevent id starts from number cause vue compile error
      uid: 'u' + Math.random().toString(36).slice(6),
      filename: filepath.substring(filepath.lastIndexOf('/') + 1),
    }
  }

  async function getBlobUrl(moduleEl) {
    // inline
    let jsCode = moduleEl.innerHTML;
    // remote
    if (moduleEl.hasAttribute('src')) {
      const url = moduleEl.getAttribute('src');
      jsCode = loadContent(url);
      moduleEl.innerHTML = jsCode;
    }

    // handle loaders
    let loaders = moduleEl.getAttribute('loader');
    if (loaders) {
      // get loader object
      loaders = loaders.split(/\s+/).map((loaderName) => loaderMap[loaderName]);
      // get loader dispatcher
      const loaderDispatch = loaderCompose(loaders.map((loader) => loader.transform));
      // get context
      const context = createContext(moduleEl, jsCode);
      // transform by loaders
      await loaderDispatch(context, {
        loaderOptions: activeOptions.loaders,
      });
      // reset result
      jsCode = context.code;
    }

    return createBlob(jsCode, 'text/javascript');
  }

  async function parseCustomImportMap() {
    const customModuleType = activeOptions.moduleType;
    const moduleEls = document.querySelectorAll(`script[type="${customModuleType}"]`);
    const customImportMap = {};
    const promises = [];

    [...moduleEls].forEach((moduleEl) => {
      const { id } = moduleEl;
      if (id) {
        const p = getBlobUrl(moduleEl).then((blobUrl) => {
          customImportMap[id] = blobUrl;
          // if module need auto mount
          // by default module will only be mounted after import
          if (moduleEl.hasAttribute('mount')) mountList.push(blobUrl);
        });
        promises.push(p);
      }
    });

    await Promise.all(promises);

    return customImportMap;
  }

  async function createImportMap() {
    // get custom import map
    const customImportMap = await parseCustomImportMap();

    // check if importmap already exist
    const importMapEl = document.querySelector('script[type="importmap"]');
    if (importMapEl) {
      throw Error('importmap already defined');
    }

    const customModuleType = activeOptions.moduleType;
    const externalMapEl = document.querySelector(`script[type="${customModuleType}-importmap"]`);
    if (externalMapEl) {
      const externalMap = JSON.parse(externalMapEl.textContent);
      Object.assign(map.imports, externalMap.imports);
      Object.assign(map.scopes, externalMap.scopes);
    }

    // merge custom import map after external(custom module first)
    Object.assign(map.imports, customImportMap);

    // create importmap
    const mapEl = document.createElement('script');
    mapEl.setAttribute('type', 'importmap');
    mapEl.textContent = JSON.stringify(map);
    insertAfter(currentScript, mapEl);

    return mapEl;
  }

  function mountCustomModules(mapEl) {
    for (const url of mountList) {
      // mount modules
      if(!installed.has(url)) {
        const el = document.createElement('script');
        el.setAttribute('type', 'module');
        el.setAttribute('src', url);
        insertAfter(mapEl, el);
        installed.add(url);
      }
    }
  }

  // entry point
  async function setupCustomModule(options = {}) {
    // set global options
    activeOptions = Object.assign({
      esmShimUrl: 'https://ga.jspm.io/npm:es-module-shims@1.4.6/dist/es-module-shims.js',
      moduleType: 'custom-module',
      loaders: {},
    }, options);
    // load esm shim
    loadEsmShim(activeOptions.esmShimUrl);
    // setup loaders
    await setupLoaders();
    // create import map
    const mapEl = await createImportMap();
    // mount modules after import map inserted
    mountCustomModules(mapEl);
  }

  function defineLoader(loader) {
    const { name, imports } = loader;
    if (name && !loaderMap[name]) {
      loaderMap[name] = loader;
      if (imports) {
        Object.assign(map.imports, imports);
      }
    }
  }

  async function customImport(moduleId) {
    const { imports } = map;
    let blobURL = imports[moduleId];
    // not yet import before
    if (!blobURL) {
      const customModuleType = activeOptions.moduleType || 'custom-module';
      const moduleEl = document.querySelector(`script[type="${customModuleType}"]#${moduleId}`);
      if (moduleEl) {
        blobURL = await getBlobUrl(moduleEl);
        // cache url
        imports[moduleId] = blobURL;
      }
    }
    // check exist
    if (blobURL) {
      const result = await import(blobURL);
      return result;
    }
    return null;
  }

  // auto implement
  if(currentScript.hasAttribute('setup')) {
    setupCustomModule();
  }

  window.customImport = customImport;

  var index = {
    setup: setupCustomModule,
    defineLoader,
    loaders: Loaders,
    importmap: map,
    registerDefault,
  };

  return index;

}));
//# sourceMappingURL=custom-module-core.js.map
