// import { map } from "./constant";
import { ImportMap } from "@/types";

export function insertAfter(target: Element, el: Element) {
  target.insertAdjacentElement('afterend', el);
}

export async function loadScripts(scripts: HTMLScriptElement[]) {
  await Promise.all(scripts.map((script) => new Promise((resolve) => {
    script.onload = () => resolve(null);
  })));
}

type CreateScriptParams = {
  src?: string;
  type?: string;
  content?: string;
  lazy?: boolean;
}

export function createScript({ src, type, content, lazy }: CreateScriptParams = {}) {
  const script = document.createElement('script');
  if (type) script.type = type;
  if (src) script.src = src;
  if (content) script.textContent = content;
  if (!lazy) document.head.appendChild(script);
  return script;
}

export function createStyle(rawStyle: string) {
  const style = document.createElement('style');
  style.textContent = rawStyle;
  document.head.appendChild(style);
  return style;
}

export function createImportMap(importmap: ImportMap) {
  const mapEl = createScript({
    type: 'importmap',
    content: JSON.stringify(importmap),
  });
  return mapEl;
}

export function createEntry(moduleUrl: string) {
  const entryEl = createScript({
    type: 'module',
    src: moduleUrl,
    lazy: true, // manually mount after importmap
  });
  return entryEl;
}
