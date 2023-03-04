export type RequiredSome<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type ImportMap = {
  imports: Record<string, string>;
  scopes: Record<string, Record<string, string>>;
}

export interface SetupOptions {
  importmap?: ImportMap;
  entry: string;
  mode: 'ts' | 'react' | 'react17' | 'vue' | 'all';
  vueCompilerPath?: string;
  publicPath?: string;
  sourceMap?: Record<string, string>;
}

export interface VueParserParams {
  code: string;
  uid: string;
  filepath: string;
}
