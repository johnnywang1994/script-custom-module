import { regexp } from '@/utils/constant';
import BasicLoader from "./basic";

class ImageLoader extends BasicLoader {
  static compile(rawCode: string) {
    super.compileBase(rawCode, (filepath) => {
      if (!regexp.isImage.test(filepath)) return;
      const code = `export default "${filepath}";`;
      const moduleUrl = super.blob.createBlobUrl(code, 'text/javascript');
      super.writeModuleUrl(filepath, moduleUrl);
    });
  }
}

export default ImageLoader;