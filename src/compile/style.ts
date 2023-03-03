import { map, regexp, reachedFilepath } from '@/utils/constant';
import transformStyle from '@/transform/style';

export default function compileStyle(rawCode: string) {
  const customImports = map.imports;
  const cssMatches = rawCode.matchAll(regexp.importCssFrom);
  for (const match of cssMatches) {
    const filepath = match[1];
    if (reachedFilepath.has(filepath)) continue;
    reachedFilepath.add(filepath);

    const { moduleUrl } = transformStyle(filepath);
    customImports[filepath] = moduleUrl;
  }
}