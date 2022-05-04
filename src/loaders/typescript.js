export default function TsLoader() {
  CustomModule.defineLoader({
    name: 'typescript',
    setup() {
      if (!window.Babel) {
        console.warn('please install "https://unpkg.com/@babel/standalone/babel.min.js" to use typescript.');
      } else {
        window.__custom_ts_loader__ = ({ code, filepath }) => {
          if (!window.Babel) return code;
          const { availablePresets, transform } = Babel;
          const { code: resolvedCode } = transform(code, {
            presets: [availablePresets.typescript],
            filename: filepath,
          });
          return resolvedCode;
        };
      }
    },
    transform(ctx) {
      return window.__custom_ts_loader__(ctx);
    },
    imports: {}
  });
}
