import { map, regexp, reachedFilepath } from '@/utils/constant';
import compileImage from "@/compile/image";
import compileStyle from '@/compile/style';
import compileVueSfc from '@/compile/vue';
import transformScript from '@/transform/script';

// parse rawCode for deps
export async function getDepsMapByCode(rawCode: string) {
  await Promise.all([
    compileImage(rawCode),
    compileScript(rawCode),
    compileStyle(rawCode),
    compileVueSfc(rawCode),
  ]);
}

export async function compileScript(rawCode: string) {
  const customImports = map.imports;
  const matches = rawCode.matchAll(regexp.importScriptFrom);
  const promises = [];
  for (const match of matches) {
    const filepath = match[1];
    if (reachedFilepath.has(filepath)) continue;
    reachedFilepath.add(filepath);

    const { moduleUrl, code: depCode } = transformScript(filepath);
    // add new deps
    customImports[filepath] = moduleUrl;
    // loop child dependency in current dependency
    promises.push(getDepsMapByCode(depCode));
  }
  await Promise.all(promises);
}