import * as path from '@/utils/path';

export default function transformBabel(rawContent: string, filepath: string) {
  const { availablePresets, availablePlugins, transform } = window.Babel;
  const resolveBuiltinPlugin = (...pluginNames: string[]) => {
    const plugin = pluginNames.find((pluginName) => availablePlugins[pluginName]);
    if (!plugin) {
      throw new Error(`Missing Babel plugin: ${pluginNames.join(', ')}`);
    }
    return availablePlugins[plugin];
  };

  const { code: resolvedCode } = transform(rawContent, {
    presets: [
      availablePresets.react,
      availablePresets.typescript,
    ],
    plugins: [
      [resolveBuiltinPlugin('proposal-decorators'), {
        version: 'legacy'
      }],
      resolveBuiltinPlugin('transform-class-properties', 'proposal-class-properties'),
      [
        window.moduleResolver,
        {
          resolvePath: function (sourcePath: string, _: unknown, opts: unknown) {
            if (
              window.__nodeModulesDeps__.has(sourcePath) ||
              sourcePath.startsWith('http://') ||
              sourcePath.startsWith('https://') ||
              sourcePath.startsWith('data:') ||
              path.isAbsolute(sourcePath)
            ) {
              return sourcePath;
            }
            return path.resolve(path.dirname(filepath), sourcePath);
          }
        }
      ]
    ],
    filename: filepath,
  });
  return resolvedCode;
}
