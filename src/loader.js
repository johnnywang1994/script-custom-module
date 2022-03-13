import BabelLoader from './loaders/babel';
import CssLoader from './loaders/css';
import ReactLoader from './loaders/react';
import SassLoader from './loaders/sass';
import VueLoader from './loaders/vue';

export function registerDefault() {
  BabelLoader();
  ReactLoader();
  CssLoader();
  SassLoader();
  VueLoader();
}

export default {
  BabelLoader,
  CssLoader,
  ReactLoader,
  SassLoader,
  VueLoader,
  registerDefault,
}