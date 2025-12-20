import * as path from '@/utils/path';

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
      availablePlugins['proposal-class-properties'],
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