export default function TsLoader() {
  CustomModule.defineLoader({
    name: 'typescript',
    setup() {
      if (!window.Babel) {
        console.warn('please install "https://unpkg.com/@babel/standalone/babel.min.js" to use typescript.');
      } else {
        window.__custom_ts_loader__ = ({ code, filepath }, loaderOptions = {}) => {
          if (!window.Babel) return code;
          const { availablePresets, availablePlugins, transform } = Babel;
          const { code: resolvedCode } = transform(code, loaderOptions.typescript || {
            presets: [availablePresets.typescript],
            // https://babeljs.io/docs/en/babel-plugin-proposal-decorators#decoratorsbeforeexport
            plugins: [
              [availablePlugins['proposal-decorators'], {
                decoratorsBeforeExport: false
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
      return window.__custom_ts_loader__(ctx, loaderOptions);
    },
    imports: {}
  });
}
