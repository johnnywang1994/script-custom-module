import http from 'http';
import minimist from 'minimist';
import finalhandler from 'finalhandler';
import serveStatic from 'serve-static';
import { formatTargetDir, startSpinner, defaultTargetDir } from './utils';

// serve-scm -p 1234 ./
const argv = minimist<{
  p: number
  port: number
  h: string
  host: string
}>(process.argv.slice(2), { string: ['_'] });

async function init() {
  const spinner = await startSpinner();

  try {
    const argTargetDir = formatTargetDir(argv._[0]);
    const port = argv.port || argv.p || 1234;
    const host = argv.host || argv.h || 'localhost';

    const targetDir = argTargetDir || defaultTargetDir;

    const serve = serveStatic(targetDir, {
      index: ['index.html', 'index.htm']
    });

    const server = http.createServer(function onRequest (req, res) {
      serve(req, res, finalhandler(req, res))
    });

    server.listen(port, host, () => {
      spinner.succeed(
        `Nodejs server listen on http://${host}:${port}`
      )
    });
  } catch (err) {
    spinner.fail(`Unhandled error occurred: ${err?.toString()}`);
  }
}
init();
