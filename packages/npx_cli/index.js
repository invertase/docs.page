#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var childProcess = require('child_process');

var binary = path.join(
  __dirname,
  'binaries',
  process.platform,
  `docs_page${process.platform === 'win32' ? '.exe' : ''}`,
);

if (!fs.existsSync(binary)) {
  throw new Error('Docs.page does not support this platform');
}

var docsPage = childProcess.spawn(binary, process.argv.slice(2), {
  stdio: ['inherit', 'inherit', 'inherit'],
  env: process.env,
});

docsPage.on('exit', event => process.exit(event.code));

process.on('SIGTERM', () => docsPage.kill('SIGTERM'));

process.on('SIGINT', () => docsPage.kill('SIGINT'));
