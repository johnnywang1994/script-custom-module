import BasicLoader from "./basic";
import { regexp } from '@/utils/constant';

class StyleLoader extends BasicLoader {
  static transform(url: string, rawContent?: string) {
    // style may be fetched by request
      const rawStyle = rawContent ? rawContent : super.requestFile(url);
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
      moduleUrl: super.blob.createBlobUrl(code, 'text/javascript'),
    }
  }

  static compile(rawCode: string) {
    super.compileBase(rawCode, (filepath) => {
      if (!regexp.isStyle.test(filepath)) return;
      const { moduleUrl } = StyleLoader.transform(filepath);
      super.writeModuleUrl(filepath, moduleUrl);
    });
  }
}

export default StyleLoader;