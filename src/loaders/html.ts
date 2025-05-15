import { regexp } from '@/utils/constant';
import BasicLoader from "./basic";

class HTMLLoader extends BasicLoader {
  static transform(url: string, rawContent?: string) {
    let code = '';
    if (rawContent) {
      code = `export default decodeURIComponent("${encodeURIComponent(rawContent)}");`;
    } else {
      code = `const res = await fetch('${url}');
export default res.ok ? await res.text() : Promise.reject(new Error('Failed to load ${url}'));`;
    }
    return {
      code,
      moduleUrl: super.blob.createBlobUrl(code, 'text/javascript'),
    }
  }

  static compile(rawCode: string) {
    super.compileBase(rawCode, (filepath) => {
      if (!regexp.isHTML.test(filepath)) return;
      const { moduleUrl } = HTMLLoader.transform(filepath);
      super.writeModuleUrl(filepath, moduleUrl);
    });
  }
}

export default HTMLLoader;
