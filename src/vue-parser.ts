import {
  parse,
  compileScript,
  compileTemplate,
  compileStyleAsync
} from '@vue/compiler-sfc';

import { createBlobUrl } from '@/utils/blob';
import { createStyle } from '@/utils/dom';
import { VueParserParams } from '@/types';

function injectStyle(rawStyle: string, lang: string | boolean) {
  if (typeof lang === 'string' && ['sass', 'scss'].includes(lang)) {
    if (window.Sass) {
      const indentedSyntax = lang === 'sass';
      window.Sass.compile(rawStyle, { indentedSyntax }, function(css: { text: string }) {
        createStyle(css.text);
      });
    } else {
      console.warn('Please install sass library to compile SFC styles');
    }
  } else {
    createStyle(rawStyle);
  }
}

function parseVueSfc({ code, uid, filepath }: VueParserParams) {
  // decode code(to safely transform string content)
  const { descriptor } = parse(decodeURIComponent(code), {
    filename: filepath,
  });
  // console.log(descriptor);

  // compile script
  const { content: scriptCode } = compileScript(descriptor, {
    id: uid,
    isProd: true,
    inlineTemplate: true,
    reactivityTransform: true,
    templateOptions: {
      ssr: false,
      // transformAssetUrls: options.transformAssetUrls || true,
    },
  });
  // console.log(scriptCode);

  // parse styles with scoped check
  let hasCssModules = false;
  let hasScoped = false;
  descriptor.styles.forEach(({ attrs, content, scoped, module }) => {
    if (module) hasCssModules = true;
    if (scoped) hasScoped = true;
    compileStyleAsync({
      source: content,
      id: `data-v-${uid}`,
      filename: filepath,
      scoped: scoped != null,
      trim: true,
    }).then(({ code: styleCode }) => {
      injectStyle(styleCode, attrs.lang);
    });
  });

  if (hasCssModules) {
    console.warn('[@vue/compiler-sfc] `modules` option is not supported in the browser build.');
  }

  // parse template
  let templateCode = '';
  if (descriptor.template) {
    const { code: template } = compileTemplate({
      id: uid,
      filename: filepath,
      source: descriptor.template.content,
      scoped: hasScoped,
      slotted: descriptor.slotted,
      compilerOptions: {
        scopeId: hasScoped ? `data-v-${uid}` : null,
      }
    });
    templateCode = template;
  }

  return {
    scriptPath: createBlobUrl(scriptCode, 'text/javascript'),
    templatePath: templateCode
      ? createBlobUrl(templateCode, 'text/javascript')
      : null,
    scoped: hasScoped,
    cssModules: hasCssModules,
  }
}

export default parseVueSfc;
