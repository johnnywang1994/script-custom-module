export default function BabelLoader() {
  // TODO: babel env exports regexp
  // /exports\.{1}(.*?)\s?\=\s?(.*?)(?<!void 0;)$/g
  CustomModule.defineLoader({
    name: 'babel',
    setup() {
      if (!window.Babel) {
        console.warn('please install "https://unpkg.com/@babel/standalone/babel.min.js" to use babel.');
      }
    },
    transform({ code }, { loaderOptions = {} }) {
      if (!window.Babel) return code;
      const { transform } = Babel;
      loaderOptions.babel = loaderOptions.babel || { presets: ['env'] };
      const { code: resolvedCode } = transform(code, loaderOptions.babel);
      if (loaderOptions.babel.presets.includes('env')) {
        return `
const exports = {};

${resolvedCode};

export default exports['default'];
        `;
      }
      return resolvedCode;
    },
  });
}
