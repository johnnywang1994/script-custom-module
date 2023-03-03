import { globalData } from '@/utils/constant';
import requestFile from '@/utils/request-file';
import { createBlobUrl } from '@/utils/blob';

function transformVueSfc(url: string, rawSfcCode?: string) {
  // use vue compiler
  const content = rawSfcCode ? rawSfcCode : requestFile(url);
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
    moduleUrl: createBlobUrl(code, 'text/javascript'),
  };
}

export default transformVueSfc;
