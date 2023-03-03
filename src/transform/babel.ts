export default function transformBabel(rawContent: string, filepath: string) {
  const { availablePresets, availablePlugins, transform } = window.Babel;
  const { code: resolvedCode } = transform(rawContent, {
    presets: [
      availablePresets.react,
      availablePresets.typescript,
    ],
    plugins: [
      [availablePlugins['proposal-decorators'], {
        version: 'legacy'
      }],
      availablePlugins['proposal-class-properties']
    ],
    filename: filepath,
  });
  return resolvedCode;
}