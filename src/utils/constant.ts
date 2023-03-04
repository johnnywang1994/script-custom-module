import mergeImportMaps from "@/utils/merge-importmaps";
import { ImportMap } from "@/types";

// Not used, just for referencing
// export const currentScript = document.currentScript || document.querySelector('script') as HTMLScriptElement;

export const map: ImportMap = {
  imports: {},
  scopes: {}
};

// cached for already reached filepath
// will cache filepath once the filepath starts compiling in order to speed up compile deps
export const reachedFilepath = new Set();

// Not used, just for referencing
// https://regexr.com/47jlq
export const regImportTemplate = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:["'](.*?)["']))[\s]*?(?:;|$|)/gi;

export const regexp = {
  importScriptFrom: /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:["'](.*\.(j|t)sx?)["']))[\s]*?(?:;|$|)/gi,
  importImageFrom: /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:["'](.*\.(jpe?g|png|svg|gif))["']))[\s]*?(?:;|$|)/gi,
  importCssFrom: /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:["'](.*\.(sa|s?c)ss)["']))[\s]*?(?:;|$|)/gi,
  importSfcFrom: /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:["'](.*\.vue)["']))[\s]*?(?:;|$|)/gi,
  isScript: /(\.(j|t)sx?)$/i,
  isVueSfc: /(\.vue)$/i,
  isStyle: /(\.(sa|s?c)ss)$/i,
};

export const globalData = {
  publicPath: '', // prefix for all requestContent
  // vue compiler esm path
  vueCompiler:
    'https://cdn.jsdelivr.net/npm/script-custom-module/dist/vue-parser.mjs',
};

export enum Modes {
  TS = 'ts',
  REACT = 'react',
  REACT_17 = 'react17',
  VUE = 'vue',
  ALL = 'all',
}

export const modeImportMaps: Record<Modes, ImportMap> = (() => {
  const config = {
    ts: {
      imports: {},
      scopes: {},
    },
    react: {
      imports: {
        "react": "https://ga.jspm.io/npm:react@18.2.0/dev.index.js",
        "react-dom": "https://ga.jspm.io/npm:react-dom@18.2.0/dev.index.js",
        "react-dom/client": "https://ga.jspm.io/npm:react-dom@18.2.0/dev.client.js",
      },
      scopes: {
        "https://ga.jspm.io/": {
          "scheduler": "https://ga.jspm.io/npm:scheduler@0.23.0/dev.index.js"
        },
      },
    },
    react17: {
      imports: {
        react: 'https://unpkg.com/@esm-bundle/react/esm/react.development.js',
        'react-dom': 'https://unpkg.com/@esm-bundle/react-dom/esm/react-dom.development.js',
        'react-is': 'https://unpkg.com/@esm-bundle/react-is/esm/react-is.development.js',
      },
      scopes: {},
    },
    vue: {
      imports: {
        vue: 'https://unpkg.com/vue@latest/dist/vue.esm-browser.js',
        '@vue/compiler-sfc': 'https://cdn.jsdelivr.net/npm/@vue/compiler-sfc@latest/dist/compiler-sfc.esm-browser.js',
      },
      scopes: {},
    },
    all: {
      imports: {},
      scopes: {},
    },
  };
  config.all = mergeImportMaps(config.ts, config.react, config.vue);
  return config;
})();
