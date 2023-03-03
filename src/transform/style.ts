import requestFile from '@/utils/request-file';
import { createBlobUrl } from '@/utils/blob';

function transformStyle(url: string, rawContent?: string) {
  // style may be fetched by request
  const rawStyle = rawContent ? rawContent : requestFile(url);
  const code = `
window.__import_styles__ = window.__import_styles__ || {};

const rawStyle = \`${rawStyle}\`;

if (!window.__import_styles__['${url}']) {
if (window.Sass) {
  window.Sass.compile(rawStyle, { indentedSyntax: false }, function(css) {
    createStyle(css.text);
  });
} else {
  createStyle(rawStyle);
}
window.__import_styles__['${url}'] = true;
}

function createStyle(rawStyle) {
const style = document.createElement('style');
style.textContent = rawStyle;
document.head.appendChild(style);
return style;
}

export default \`${rawStyle}\`;`;
  return {
    code,
    moduleUrl: createBlobUrl(code, 'text/javascript'),
  }
}

export default transformStyle;
