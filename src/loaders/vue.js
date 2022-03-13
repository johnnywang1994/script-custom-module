export default function VueLoader() {
  window.__custom_vue_cache__ = {};

  CustomModule.defineLoader({
    name: 'vue',
    setup() {
      window.__custom_vue_loader__ = (compiler, { code, uid, filepath }) => {
        if (!__custom_vue_cache__[uid]) {
          const { parse, compileScript, compileTemplate, compileStyleAsync } = compiler;

          // parse code by atob(to safely transform string content)
          const { descriptor } = parse(window.atob(code), {
            filename: filepath
          });
          // console.log(descriptor);

          // compile script
          const { content: scriptCode } = compileScript(descriptor, {
            id: uid,
          });

          // parse styles with scoped check
          let hasCssModules = false;
          let hasScoped = false;
          descriptor.styles.forEach(({ attrs, content, scoped, module }) => {
            // TODO: css module support
            if (module) hasCssModules = true;
            if (scoped) hasScoped = true;
            compileStyleAsync({
              source: content,
              id: `data-v-${uid}`,
              filename: filepath,
              scoped,
              trim: true,
            }).then(({ code: styleCode }) => {
              injectStyle(styleCode, uid, attrs.lang);
            });
          })

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

          // cache result
          __custom_vue_cache__[uid] = {
            template: createBlob(templateCode, 'text/javascript'),
            script: createBlob(scriptCode, 'text/javascript'),
            scoped: hasScoped,
            cssModules: hasCssModules,
          }
        }
      };

      function injectStyle(content, uid, lang) {
        if (['sass', 'scss'].includes(lang)) {
          if (isFn(window.__custom_sass_loader__)) {
            window.__custom_sass_loader__(content, uid, {
              indentedSyntax: lang === 'sass',
            });
          } else {
            console.warn('Please install custom-sass-loader to compile SFC styles');
          }
        } else if (isFn(window.__custom_css_loader__)) {
          window.__custom_css_loader__(content, uid);
        } else {
          console.warn('Please install custom-css-loader to compile SFC styles');
        }
      }

      function createBlob(code, type = 'text/plain') {
        const blob = new Blob([code], { type });
        return URL.createObjectURL(blob);
      }

      function isFn(v) {
        return typeof v === 'function';
      }
    },
    transform({ code, uid, filepath, filename }) {
      const options = {
        code: window.btoa(code),
        uid,
        filepath,
        filename,
      };
      const result = `
import {
  parse,
  compileScript,
  compileTemplate,
  compileStyleAsync
} from '@vue/compiler-sfc';

const uid = "${uid}";
const compiler = {
  parse,
  compileScript,
  compileTemplate,
  compileStyleAsync
};

window.__custom_vue_loader__(compiler, ${JSON.stringify(options)});

const script = (await import(__custom_vue_cache__[uid].script)).default;

if (__custom_vue_cache__[uid].template) {
  const { render } = (await import(__custom_vue_cache__[uid].template));
  script.render = render;
}

if (__custom_vue_cache__[uid].scoped) script.__scopeId = \`data-v-${uid}\`;

// TODO: css module support
if (__custom_vue_cache__[uid].cssModules) {
  script.__cssModules = {}
}

export default script;
      `;

      return result;
    },
    imports: {
      vue: 'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
      '@vue/compiler-sfc': 'https://cdn.jsdelivr.net/npm/@vue/compiler-sfc@3/dist/compiler-sfc.esm-browser.js',
    }
  });
}
