import { map, regexp, reachedFilepath, globalData } from "@/utils/constant";
import { createBlobUrl, revokeBlobUrls } from "@/utils/blob";

class BasicLoader {
  static blob: {
    createBlobUrl: (code: string, type?: string) => string;
    revokeBlobUrls: (urls: string[]) => void;
  } = {
    createBlobUrl,
    revokeBlobUrls,
  }

  static writeModuleUrl(filepath: string, moduleUrl: string) {
    const customImports = map.imports;
    customImports[filepath] = moduleUrl;
  }

  static requestFile(url: string) {
    // console.log('reqeust', url);
    const request = new XMLHttpRequest();
    // use sync to avoid popup blocker
    request.open('GET', globalData.publicPath + url, false); // `false` makes the request synchronous
    request.send(null);
    if(request.status === 200) {
      return request.responseText;
    }
    throw new Error(request.statusText);
  }

  static async compileBase(rawCode: string, handler: (filepath: string) => unknown) {
    const matches = rawCode.matchAll(regexp.importFrom);
    const promises: unknown[] = [];
    for (const match of matches) {
      const filepath = match[1];
      if (reachedFilepath.has(filepath)) continue;
      const result = handler(filepath);
      if (typeof result !== 'undefined') {
        promises.push(result);
        reachedFilepath.add(filepath); // mark as reached only if result is not undefined
      }
    }
    await Promise.all(promises);
  }

  static transform(url: string, rawContent?: string) {
    throw new Error('Method not implemented.');
  }

  static compile(rawCode: string) {
    throw new Error('Method not implemented.');
  }
}

export default BasicLoader;
