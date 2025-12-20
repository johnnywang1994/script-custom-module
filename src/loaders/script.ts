import { regexp, globalData } from "@/utils/constant";
import transformBabel from "@/utils/babel";
import BasicLoader from "./basic";

class ScriptLoader extends BasicLoader {
  static async getDepsMapByCode(code: string) {
    await Promise.all(globalData.loaders.map((loader) => {
      return loader.compile(code);
    }));
  }

  static transform(url: string, rawContent?: string) {
    // script may be fetched by request
    const content = rawContent ? rawContent : super.requestFile(url);
    const code = transformBabel(content, url);
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
