export default function ReactLoader() {
  CustomModule.defineLoader({
    name: 'react',
    setup() {
      if (!window.Babel) {
        console.warn('please install "https://unpkg.com/@babel/standalone/babel.min.js" to use react.');
      } else {
        window.__custom_react_loader__ = ({ code, filepath }) => {
          if (!window.Babel) return code;
          const { availablePresets, transform } = Babel;
          const { code: resolvedCode } = transform(code, {
            presets: [availablePresets.react],
            filename: filepath,
          });
          return resolvedCode;
        };
      }
    },
    transform(ctx) {
      return window.__custom_react_loader__(ctx);
    },
    imports: {
      react: 'https://unpkg.com/@esm-bundle/react/esm/react.development.js',
      'react-dom': 'https://unpkg.com/@esm-bundle/react-dom/esm/react-dom.development.js',
      'react-is': 'https://unpkg.com/@esm-bundle/react-is/esm/react-is.development.js',
      'styled-components': 'https://unpkg.com/@esm-bundle/styled-components/esm/styled-components.browser.min.js'
    }
  });
}
