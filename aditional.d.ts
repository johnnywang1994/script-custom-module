declare namespace globalThis {
  interface Window {
    setupCustomScript: any;
    Babel: any;
    Sass: any;
  }
}

declare module 'copy-template-dir' {
  function copy(
    templateDir: string,
    targetDir: string,
    vars?: Record<string, string>,
    cb?: (err: Error, createdFiles: string[]) => void
  ): void
  export = copy
}