import { regexp, globalData } from '@/utils/constant';
import BasicLoader from "./basic";
import ScriptLoader from './script';

class VueLoader extends BasicLoader {
  static transform(url: string, rawSfcCode?: string) {
    // use vue compiler
    const content = rawSfcCode ? rawSfcCode : super.requestFile(url);
    const filepath = url;
    const code = `
import parseVueSfc from '${globalData.vueCompiler}';

const uid = "${Math.random().toString(36).slice(6)}";
const code = "${encodeURIComponent(content)}";

let script;

if (!script) {
  const { scriptPath, templatePath, scoped, cssModules } = parseVueSfc({
    code,
    uid,
    filepath: "${filepath}",
  });
  script = (await import(scriptPath)).default;

  if (templatePath) {
    const { render } = (await import(templatePath));
    script.render = render;
  }

  if (scoped) script.__scopeId = \`data-v-\${uid}\`;

  if (cssModules) {
    script.__cssModules = {};
  }
}

export default script;`;
    return {
      code: content, // return raw vue sfc content to parse dependency
      moduleUrl: super.blob.createBlobUrl(code, 'text/javascript'),
    };
  }

  static async compile(rawCode: string) {
    await super.compileBase(rawCode, (filepath) => {
      if (!regexp.isVueSfc.test(filepath)) return;
      const { moduleUrl, code: depCode } = VueLoader.transform(filepath);
      super.writeModuleUrl(filepath, moduleUrl);

      const scriptStart = depCode.indexOf('<script');
      const scriptEnd = depCode.lastIndexOf('</script');
      const scriptContent = depCode.substring(scriptStart, scriptEnd);
      return ScriptLoader.getDepsMapByCode(scriptContent);
    });
  }
}

export default VueLoader;