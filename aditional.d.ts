declare namespace globalThis {
  interface Window {
    setupCustomScript: any;
    Babel: any;
    Sass: any;
    moduleResolver: any; // Babel module resolver plugin for browser
    __nodeModulesDeps__: Set<string>;
    __import_styles__: Record<string, boolean>;
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