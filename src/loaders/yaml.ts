import { map, regexp } from '@/utils/constant';
import BasicLoader from "./basic";

const yamlEsmPath = 'https://ga.jspm.io/npm:yaml@2.7.1/browser/index.js';

class YamlLoader extends BasicLoader {
  static transform(url: string, rawContent?: string) {
    let code = '';
    if (rawContent) {
      code = `import { parse } from '${yamlEsmPath}';
const ymlText = decodeURIComponent("${encodeURIComponent(rawContent)}");
const result = parse(ymlText);
export default result;`;
    } else {
      code = `const res = await fetch('${url}');

let result = null;
if (res.ok) {
  const { parse } = await import('https://ga.jspm.io/npm:yaml@2.7.1/browser/index.js');
  const ymlText = await res.text();
  result = parse(ymlText);
} else {
  Promise.reject(new Error('Failed to load ${url}'));
}
export default result;`;
    }
    return {
      code,
      moduleUrl: super.blob.createBlobUrl(code, 'text/javascript'),
    }
  }

  static compile(rawCode: string) {
    const customImports = map.imports;

    super.compileBase(rawCode, (filepath) => {
      if (!regexp.isYaml.test(filepath)) return;
      const { moduleUrl } = YamlLoader.transform(filepath);
      customImports[filepath] = moduleUrl;
    });
  }
}

export default YamlLoader;
