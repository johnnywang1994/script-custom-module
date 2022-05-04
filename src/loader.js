import BabelLoader from './loaders/babel';
import CssLoader from './loaders/css';
import ReactLoader from './loaders/react';
import SassLoader from './loaders/sass';
import VueLoader from './loaders/vue';
import TsLoader from './loaders/typescript';

export function registerDefault() {
  BabelLoader();
  ReactLoader();
  CssLoader();
  SassLoader();
  VueLoader();
  TsLoader();
}

export default {
  BabelLoader,
  CssLoader,
  ReactLoader,
  SassLoader,
  VueLoader,
  TsLoader,
  registerDefault,
}