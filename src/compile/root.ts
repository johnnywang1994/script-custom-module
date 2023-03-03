import transformScript from '@/transform/script';
import { getDepsMapByCode } from '@/compile/script';
import { map } from '@/utils/constant';
import { createEntry } from '@/utils/dom';

async function compileRoot(rootUrl: string) {
  // if rootUrl not provided, auto search for [type=root-module]
  let rootContent: string | undefined;
  if (!rootUrl) {
    const root = document.querySelector('script[type="root-module"]');
    if (!root) {
      throw Error('Please provide root module to compile!');
    }
    rootUrl = root.getAttribute('src') || root.id;
    rootContent = root.textContent as string;
  }
  // compile root
  const { moduleUrl, code } = transformScript(rootUrl, rootContent);
  map.imports[rootUrl] = moduleUrl;
  // get deps(need to await for root)
  await getDepsMapByCode(code);
  // mount the entry module
  const entry = createEntry(moduleUrl);
  return entry;
}

export default compileRoot;
