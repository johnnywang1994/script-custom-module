import { ImportMap } from "@/types";

export default function mergeImportMaps(...importmaps: ImportMap[]) {
  return importmaps.reduce(
    (merged: ImportMap, importmap: ImportMap) => {
      merged.imports = { ...importmap.imports, ...merged.imports };
      merged.scopes = { ...importmap.scopes, ...merged.scopes };
      return merged;
    },
    { imports: {}, scopes: {} }
  );
}