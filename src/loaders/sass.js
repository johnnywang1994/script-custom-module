export default function SassLoader() {
  window.__custom_css_cache__ = window.__custom_css_cache__ || {};

  CustomModule.defineLoader({
    name: 'sass',
    setup() {
      window.__custom_sass_loader__ = (code, uid, opts) => {
        if (!__custom_css_cache__[uid]) {
          if (window.Sass) {
            Sass.compile(code, opts, function(css) {
              const href = __custom_css_cache__[uid] = createBlob(css.text, 'text/css');
              const link = document.createElement('link');
              link.setAttribute('rel', 'stylesheet');
              link.setAttribute('href', href);
              document.head.appendChild(link);
            })
          } else {
            console.warn('please install "https://cdn.jsdelivr.net/npm/sass.js@0.11.1/dist/sass.sync.js" to compile sass file.');
          }
        }
      };

      function createBlob(code, type = 'text/plain') {
        const blob = new Blob([code], { type });
        return URL.createObjectURL(blob);
      }
    },
    transform({ code, uid, filename }, { loaderOptions = {} }) {
      const options = {
        indentedSyntax: false,
        ...(loaderOptions.sass || {}),
      };
      if (filename.endsWith('.sass')) options.indentedSyntax = true;
      else if (filename.endsWith('.scss')) options.indentedSyntax = false;

      return `
const code = \`${code}\`;
const options = ${JSON.stringify(options, null , 2)};

window.__custom_sass_loader__(code, "${uid}", options);

export default code;
      `;
    },
  });
}
