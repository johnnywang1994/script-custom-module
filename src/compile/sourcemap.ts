import { map, regexp } from '@/utils/constant';
import ScriptLoader from '@/loaders/script';
import VueLoader from '@/loaders/vue';
import StyleLoader from '@/loaders/style';
import HTMLLoader from '@/loaders/html';
import JsonLoader from '@/loaders/json';
import YamlLoader from '@/loaders/yaml';

async function compileSourceMap(sourcemap: Record<string, string>) {
  const customImports = map.imports;
  Object.keys(sourcemap).forEach((key) => {
    const rawCode = sourcemap[key];
    let moduleUrl;
    // matching
    if (regexp.isScript.test(key)) {
      ({ moduleUrl } = ScriptLoader.transform(key, rawCode));
      customImports[key] = moduleUrl;
    } else if (regexp.isVueSfc.test(key)) {
      ({ moduleUrl } = VueLoader.transform(key, rawCode));
    } else if (regexp.isStyle.test(key)) {
      ({ moduleUrl } = StyleLoader.transform(key, rawCode));
    } else if (regexp.isHTML.test(key)) {
      ({ moduleUrl } = HTMLLoader.transform(key, rawCode));
    } else if (regexp.isJson.test(key)) {
      ({ moduleUrl } = JsonLoader.transform(key, rawCode));
    } else if (regexp.isYaml.test(key)) {
      ({ moduleUrl } = YamlLoader.transform(key, rawCode));
    }
    if (moduleUrl) {
      customImports[key] = moduleUrl;
    }
  });
}

export default compileSourceMap;
