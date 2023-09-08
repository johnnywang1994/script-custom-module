const defaultTargetDir = 'scm-project';

async function startSpinner() {
  return (await import('ora')).default({
    text: 'Loading...',
    prefixText: '[Script Custom Module]',
  }).start();
}

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

export {
  defaultTargetDir,
  formatTargetDir,
  startSpinner,
}