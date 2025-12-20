// 模擬 Node.js path.join
export function join(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/(^\/|\/$)/g, (m, i) => (i === 0 ? '/' : ''));
}

// 模擬 Node.js path.resolve（僅支援簡單情境）
export function resolve(...paths: string[]): string {
  let resolvedPath = '';
  let absolute = false;

  for (let i = paths.length - 1; i >= 0; i--) {
    const segment = paths[i];
    if (!segment) continue;
    resolvedPath = segment.replace(/\/+$/, '') + '/' + resolvedPath;
    if (segment[0] === '/') {
      absolute = true;
      break;
    }
  }

  resolvedPath = resolvedPath.replace(/\/+/g, '/');
  const segments = resolvedPath.split('/').filter(Boolean);
  const stack: string[] = [];

  for (const seg of segments) {
    if (seg === '..') {
      stack.pop();
    } else if (seg !== '.') {
      stack.push(seg);
    }
  }

  return (absolute ? '/' : '') + stack.join('/');
}

export function dirname(filepath: string): string {
  const parts = filepath.split('/');
  parts.pop();
  return parts.join('/') || '/';
}

export function extname(filepath: string): string {
  const base = filepath.split('/').pop() || '';
  const dotIndex = base.lastIndexOf('.');
  return dotIndex !== -1 ? base.substring(dotIndex) : '';
}

export function isAbsolute(filepath: string): boolean {
  return filepath.startsWith('/');
}