export type ImportMap = {
  imports: Record<string, string>;
  scopes: Record<string, string>;
}

export interface SetupOptions {
  importmap?: ImportMap;
  entry: string;
  sourceMap?: Record<string, string>;
  publicPath?: string;
  vueCompilerPath?: string;
}

export interface VueParserParams {
  code: string;
  uid: string;
  filepath: string;
}
