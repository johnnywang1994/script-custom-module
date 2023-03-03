import compileSourceMap from "@/compile/sourcemap";
import compileRoot from '@/compile/root';
import { map, globalData } from "@/utils/constant";
import { createImportMap, createEntry } from '@/utils/dom';
import { revokeBlobUrls } from '@/utils/blob';
import { SetupOptions } from "@/types";

async function setupCustomScript(options: SetupOptions) {
  const {
    importmap = { imports: {}, scopes: {} },
    entry,
    sourceMap,
    publicPath,
    vueCompilerPath
  } = options;
  if (publicPath) {
    globalData.publicPath = publicPath;
  }
  if (vueCompilerPath) {
    globalData.vueCompiler = vueCompilerPath;
  }

  let entryScript;
  if (sourceMap) {
    // sourceMap mode: use sourcemap entry
    compileSourceMap(sourceMap);
    entryScript = createEntry(map.imports[entry]);
  } else {
    // normal mode: parse all deps in root
    entryScript = await compileRoot(entry);
  }

  // mount importmap before mounting entry
  map.imports = Object.assign({}, importmap.imports, map.imports);
  map.scopes = Object.assign({}, importmap.scopes, map.scopes);
  createImportMap(map);
  // mount entry
  document.head.appendChild(entryScript);
  // auto revoke all blobUrls before window unload
  window.addEventListener('beforeunload', () => revokeBlobUrls(Object.values(map.imports)));
}

export default setupCustomScript;
