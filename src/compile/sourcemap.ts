import { map, regexp } from '@/utils/constant';
import transformScript from '@/transform/script';
import transformVueSfc from '@/transform/vue';
import transformStyle from '@/transform/style';

async function compileSourceMap(sourcemap: Record<string, string>) {
  const customImports = map.imports;
  Object.keys(sourcemap).forEach((key) => {
    // not suppported
    if (key.endsWith('html')) return;

    const rawCode = sourcemap[key];
    let moduleUrl;
    // matching
    if (regexp.isScript.test(key)) {
      ({ moduleUrl } = transformScript(key, rawCode));
      customImports[key] = moduleUrl;
    } else if (regexp.isVueSfc.test(key)) {
      ({ moduleUrl } = transformVueSfc(key, rawCode));
    } else if (regexp.isStyle.test(key)) {
      ({ moduleUrl } = transformStyle(key, rawCode));
    }
    if (moduleUrl) {
      customImports[key] = moduleUrl;
    }
  });
}

export default compileSourceMap;
