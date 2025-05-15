import loadDependency from '@/loadDependency';
import setupCustomScript from '@/setupCustomScript';
import { SetupOptions } from "@/types";

export const setup = async (options: SetupOptions) => {
  await loadDependency();
  setupCustomScript(options);
};

export { default as defaultLoaders, BasicLoader, Loaders } from '@/loaders';