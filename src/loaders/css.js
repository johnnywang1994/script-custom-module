export default function CssLoader() {
  window.__custom_css_cache__ = window.__custom_css_cache__ || {};

  CustomModule.defineLoader({
    name: 'css',
    setup() {
      window.__custom_css_loader__ = (code, uid) => {
        if (!__custom_css_cache__[uid]) {
          const href = __custom_css_cache__[uid] = createBlob(code, 'text/css');
          const link = document.createElement('link');
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('href', href);
          document.head.appendChild(link);
        }
      };

      function createBlob(code, type = 'text/plain') {
        const blob = new Blob([code], { type });
        return URL.createObjectURL(blob);
      }
    },
    transform({ code, uid }) {
      return `
const code = \`${code}\`;

window.__custom_css_loader__(code, "${uid}");

export default code;
      `;
    },
  });
}
