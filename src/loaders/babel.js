export default function BabelLoader() {
  CustomModule.defineLoader({
    name: 'babel',
    setup() {
      if (!window.Babel) {
        console.warn('please install "https://unpkg.com/@babel/standalone/babel.min.js" to use babel.');
      } else {
        window.__custom_babel_loader__ = ({ code, filepath }, loaderOptions = {}) => {
          if (!window.Babel) return code;
          const { availablePresets, availablePlugins, transform } = Babel;
          const { code: resolvedCode } = transform(code, loaderOptions.babel || {
            presets: [
              [availablePresets.env, { modules: false }],
            ],
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
      return window.__custom_babel_loader__(ctx, loaderOptions);
    },
  });
}
