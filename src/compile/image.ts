import { map, regexp, reachedFilepath } from "@/utils/constant";
import { createBlobUrl } from '@/utils/blob';

export default function compileImage(rawCode: string) {
  const customImports = map.imports;
  const imageMatches = rawCode.matchAll(regexp.importImageFrom);
  for (const match of imageMatches) {
    const filepath = match[1];
    if (reachedFilepath.has(filepath)) continue;
    reachedFilepath.add(filepath);

    const code = `export default "${filepath}";`;
    customImports[filepath] = createBlobUrl(code, 'text/javascript');
  }
}
