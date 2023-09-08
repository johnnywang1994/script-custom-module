import path from 'path';
import minimist from 'minimist';
import copyTemplate from 'copy-template-dir';
import { formatTargetDir, startSpinner, defaultTargetDir } from './utils';

const allowedTemplate = ['react', 'vue'] as const;
type AllowedTemplate = typeof allowedTemplate[number];

// create-scm -t react ./my-react-prac
const argv = minimist<{
  t: AllowedTemplate
  template: AllowedTemplate
}>(process.argv.slice(2), { string: ['_'] });

const templateDirBase = {
  react: 'react',
  vue: 'vue'
};

async function init() {
  const spinner = await startSpinner();

  try {
    const argTargetDir = formatTargetDir(argv._[0]);
    const argTemplate = argv.template || argv.t || 'react';

    if (!allowedTemplate.includes(argTemplate)) {
      spinner.fail(`Template "${argTemplate}" not defined!`);
      return;
    }

    const targetDir = argTargetDir || defaultTargetDir
    const projectName = targetDir === '.' ? path.basename(path.resolve()) : targetDir;

    const templateBase = templateDirBase[argTemplate];
    const templateDir = path.resolve(
      __dirname,
      '../template',
      templateBase,
    );

    const variables = {
      projectName: path.basename(projectName),
    };
    copyTemplate(templateDir, projectName, variables, () => {
      spinner.succeed(
        `Project "${projectName}" created successful with template "${argTemplate}"`
      );
    });
  } catch (err) {
    spinner.fail(`Unhandled error occurred: ${err?.toString()}`);
  }
}
init();