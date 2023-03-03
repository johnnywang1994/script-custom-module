import { map, regexp, reachedFilepath } from '@/utils/constant';
import { getDepsMapByCode } from '@/compile/script';
import transformVueSfc from '@/transform/vue';

async function compileVueSfc(rawCode: string) {
  const customImports = map.imports;
  const sfcMatches = rawCode.matchAll(regexp.importSfcFrom);

  const promises = [];
  for (const match of sfcMatches) {
    const filepath = match[1];
    if (reachedFilepath.has(filepath)) continue;
    reachedFilepath.add(filepath);

    const { moduleUrl, code: depCode } = transformVueSfc(filepath);
    customImports[filepath] = moduleUrl;

    const scriptStart = depCode.indexOf('<script');
    const scriptEnd = depCode.lastIndexOf('</script');
    const scriptContent = depCode.substring(scriptStart, scriptEnd);
    promises.push(getDepsMapByCode(scriptContent));
  }
  await Promise.all(promises);
}

export default compileVueSfc;
