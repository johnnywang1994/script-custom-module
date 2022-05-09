export default function ReactLoader() {
  CustomModule.defineLoader({
    name: 'react',
    setup() {
      if (!window.Babel) {
        console.warn('please install "https://unpkg.com/@babel/standalone/babel.min.js" to use react.');
      } else {
        window.__custom_react_loader__ = ({ code, filepath }, loaderOptions = {}) => {
          if (!window.Babel) return code;
          const { availablePresets, availablePlugins, transform } = Babel;
          const { code: resolvedCode } = transform(code, loaderOptions.react || {
            presets: [availablePresets.react],
            // https://babeljs.io/docs/en/babel-plugin-proposal-decorators#decoratorsbeforeexport
            plugins: [
              [availablePlugins['proposal-decorators'], {
                // decoratorsBeforeExport: false,
                version: 'legacy'
              }],
              availablePlugins['proposal-class-properties']
            ],
            filename: filepath,
          });
          return resolvedCode;
        };
      }
    },
    transform(ctx, { loaderOptions = {} }) {
      return window.__custom_react_loader__(ctx, loaderOptions);
    },
    imports: {
      react: 'https://unpkg.com/@esm-bundle/react/esm/react.development.js',
      'react-dom': 'https://unpkg.com/@esm-bundle/react-dom/esm/react-dom.development.js',
      'react-is': 'https://unpkg.com/@esm-bundle/react-is/esm/react-is.development.js',
      'styled-components': 'https://unpkg.com/@esm-bundle/styled-components/esm/styled-components.browser.min.js'
    }
  });
}
