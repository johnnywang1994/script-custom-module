import { regexp, globalData } from "@/utils/constant";
import BasicLoader from "./basic";

class ScriptLoader extends BasicLoader {
  static async getDepsMapByCode(rawCode: string) {
    await Promise.all(globalData.loaders.map((loader) => {
      return loader.compile(rawCode);
    }));
  }

  static transformBabel(rawContent: string, filepath: string) {
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

  static transform(url: string, rawContent?: string) {
    // script may be fetched by request
    const content = rawContent ? rawContent : super.requestFile(url);
    const code = ScriptLoader.transformBabel(content, url);
    const moduleUrl = super.blob.createBlobUrl(code, 'text/javascript');
    return {
      moduleUrl,
      code,
    };
  }

  static async compile(rawCode: string) {
    await super.compileBase(rawCode, (filepath) => {
      if (!regexp.isScript.test(filepath)) return;

      const { moduleUrl, code: depCode } = ScriptLoader.transform(filepath);
      // add new deps
      super.writeModuleUrl(filepath, moduleUrl);
      // loop child dependency in current dependency
      return ScriptLoader.getDepsMapByCode(depCode);
    });
  }
}

export default ScriptLoader;
