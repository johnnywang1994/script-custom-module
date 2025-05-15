import ScriptLoader from "./script";
import StyleLoader from "./style";
import ImageLoader from "./image";
import HTMLLoader from "./html";
import JsonLoader from "./json";
import YamlLoader from "./yaml";
import VueLoader from "./vue";

export { default as BasicLoader } from "./basic";

export const Loaders = Object.freeze({
  ScriptLoader,
  StyleLoader,
  ImageLoader,
  HTMLLoader,
  JsonLoader,
  YamlLoader,
  VueLoader,
});

const defaultLoaders = Object.values(Loaders);

export default defaultLoaders;
