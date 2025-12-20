import { regexp, globalData } from '@/utils/constant';
import BasicLoader from "./basic";
import ScriptLoader from './script';
import transformBabel from '@/utils/babel';

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

      // 支援多個 <script> tag，合併內容
      const scriptMatches = Array.from(depCode.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi));
      const scriptContent = scriptMatches.map(m => m[1]).join('\n');
      return ScriptLoader.getDepsMapByCode(
        // in order to parse dependencies in Vue SFC correctly
        // we need to transform script content with babel first
        transformBabel(scriptContent, filepath)
        // then we also use transformBabel in VueParser, so dependencies can be resolved correctly
      );
    });
  }
}

export default VueLoader;