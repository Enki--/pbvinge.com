import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export function javascriptFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? javascriptFiles(filename)
      : entry.isFile() && /\.(?:js|mjs|cjs)$/.test(filename) ? [filename] : [];
  });
}

export function checkJavaScript(projectRoot) {
  const roots = ['src', 'scripts', 'public/scripts'];
  const files = roots.flatMap(name => javascriptFiles(path.join(projectRoot, name)));
  for (const name of ['astro.config.mjs', 'tailwind.config.mjs']) {
    const filename = path.join(projectRoot, name);
    if (fs.existsSync(filename)) files.push(filename);
  }
  for (const filename of files) {
    const result = spawnSync(process.execPath, ['--check', filename], { stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) return result.status ?? 1;
  }
  console.log('JavaScript syntax checks passed for ' + files.length + ' application/tool files.');
  return 0;
}

export function checkSource(projectRoot, { javascriptOnly = false, noSync = false } = {}) {
  const syntax = checkJavaScript(projectRoot);
  if (syntax || javascriptOnly) return syntax;
  const require = createRequire(path.join(projectRoot, 'package.json'));
  try {
    require.resolve('@astrojs/check');
    require.resolve('typescript');
  } catch {
    throw new Error('Install the locked development dependencies before running the Astro source check.');
  }
  const astroDirectory = path.dirname(require.resolve('astro/package.json'));
  const args = [path.join(astroDirectory, 'astro.js'), 'check',
    '--tsconfig', path.join(projectRoot, 'tsconfig.json')];
  if (noSync) args.push('--noSync');
  const result = spawnSync(process.execPath, args, {
    cwd: projectRoot,
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', CI: 'true' },
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    process.exitCode = checkSource(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), {
      javascriptOnly: process.argv.includes('--javascript-only'),
      noSync: process.argv.includes('--no-sync'),
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
