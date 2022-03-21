import {
  insertBefore,
  insertAfter,
  loadContent,
  createBlob,
  loaderCompose
} from './utils';

import Loaders, { registerDefault } from './loader';

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
  if (shimUrl) {
    const esmShim = document.createElement('script');
    esmShim.setAttribute('async', true);
    esmShim.setAttribute('src', shimUrl);
    insertBefore(currentScript, esmShim);
  }
}

async function setupLoaders() {
  const promises = [];
  Object.keys(loaderMap).forEach((name) => {
    const loader = loaderMap[name];
    if (typeof loader.setup === 'function') {
      const p = Promise.resolve(loader.setup());
      promises.push(p);
    }
  })
  await Promise.all(promises);
}

function createContext(moduleEl, code) {
  // must have file extension for @vue/compiler to generate mapping
  const filepath = moduleEl.getAttribute('src') || moduleEl.id;
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
  let jsCode = moduleEl.textContent;
  // remote
  if (moduleEl.hasAttribute('src')) {
    const url = moduleEl.getAttribute('src');
    jsCode = loadContent(url);
    moduleEl.textContent = jsCode;
  } else if (moduleEl.hasAttribute('decode')) {
    jsCode = moduleEl.textContent = decodeURI(moduleEl.textContent);
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
  })

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

export default {
  setup: setupCustomModule,
  defineLoader,
  loaders: Loaders,
  importmap: map,
  registerDefault,
}

