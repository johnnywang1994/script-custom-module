import compileSourceMap from "@/compile/sourcemap";
import compileRoot from '@/compile/root';
import defaultLoaders from "@/loaders";
import BasicLoader from "@/loaders/basic";
import { map, globalData, modeImportMaps } from "@/utils/constant";
import { createImportMap, createEntry } from '@/utils/dom';
import mergeImportMaps from '@/utils/mergeImportmaps';
import { SetupOptions, RequiredSome } from "@/types";

function setGlobalData(options: SetupOptions) {
  const { publicPath, vueCompilerPath, loaders } = options;
  // overwrite default loaders if user provided
  globalData.loaders = loaders ?? defaultLoaders;
  if (typeof publicPath === 'string') {
    globalData.publicPath = publicPath;
  }
  if (typeof vueCompilerPath === 'string') {
    globalData.vueCompiler = vueCompilerPath;
  }
}

function setDefaultMode(options: SetupOptions) {
  const {
    importmap = { imports: {}, scopes: {} },
    mode = 'ts',
  } = options;
  options.importmap = mergeImportMaps(importmap, modeImportMaps[mode]);
}

async function getEntryScript(options: SetupOptions) {
  const { entry, sourceMap } = options;
  let entryScript;
  if (sourceMap) {
    // sourceMap mode: use sourcemap entry
    compileSourceMap(sourceMap);
    entryScript = createEntry(map.imports[entry]);
  } else {
    // normal mode: fetch & parse all deps in root
    entryScript = await compileRoot(entry);
  }
  return entryScript;
}

async function setupCustomScript(options: SetupOptions) {
  setGlobalData(options);
  setDefaultMode(options);

  const { importmap } = options as RequiredSome<SetupOptions, 'importmap'>;
  const entryScript = await getEntryScript(options);

  // merge parsed importmap to custom importmap
  const {
    imports: mergedImports,
    scopes: mergedScopes
  } = mergeImportMaps(importmap, map);
  map.imports = mergedImports;
  map.scopes = mergedScopes;
  // mount importmap before mounting entry
  createImportMap(map);
  // mount entry
  document.head.appendChild(entryScript);
  // auto revoke all blobUrls before window unload
  window.addEventListener('beforeunload', () => BasicLoader.blob.revokeBlobUrls(Object.values(map.imports)));
}

export default setupCustomScript;
