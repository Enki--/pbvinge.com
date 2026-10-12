import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

export function sourceFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(name) : entry.isFile() ? [name] : [];
  });
}

export function transpileProject(projectRoot, outputDirectory) {
  const sourceRoot = path.join(projectRoot, 'src');
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, 'package.json'), '{"type":"commonjs"}\n');
  for (const filename of sourceFiles(sourceRoot)) {
    const relative = path.relative(projectRoot, filename);
    if (/\.d\.ts$/.test(filename)) continue;
    if (/\.json$/.test(filename)) {
      const destination = path.join(outputDirectory, relative);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(filename, destination);
      continue;
    }
    if (!/\.(?:ts|tsx|js|mjs)$/.test(filename)) continue;
    const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      fileName: filename,
      reportDiagnostics: true,
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        resolveJsonModule: true,
      },
    });
    const errors = (result.diagnostics ?? []).filter(item => item.category === ts.DiagnosticCategory.Error);
    if (errors.length) {
      throw new Error(ts.formatDiagnostics(errors, {
        getCurrentDirectory: () => projectRoot,
        getCanonicalFileName: name => name,
        getNewLine: () => '\n',
      }));
    }
    const destination = path.join(outputDirectory, relative.replace(/\.(?:ts|tsx|mjs)$/, '.js'));
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, result.outputText);
  }
  return path.join(outputDirectory, 'src');
}

export function runTests(projectRoot, selected = []) {
  const testDirectory = path.join(projectRoot, 'tests');
  const tests = selected.length ? selected.map(name => path.resolve(projectRoot, name))
    : sourceFiles(testDirectory).filter(name => name.endsWith('.test.mjs'));
  if (!tests.length) throw new Error('No .test.mjs regression tests found.');
  const parent = process.env.PBV_TEST_BUILD_PARENT ?? path.join(projectRoot, '.local');
  fs.mkdirSync(parent, { recursive: true });
  const temporary = fs.mkdtempSync(path.join(parent, 'test-build-'));
  try {
    const compiledSource = transpileProject(projectRoot, temporary);
    const environment = { ...process.env, PBV_TEST_BUILD_DIR: compiledSource };
    // A runner smoke test launches another process; do not inherit Node's internal
    // marker that would otherwise silently skip the nested test files.
    delete environment.NODE_TEST_CONTEXT;
    const result = spawnSync(process.execPath, ['--test', ...tests], {
      cwd: projectRoot,
      env: environment,
      stdio: 'inherit',
    });
    if (result.error) throw result.error;
    return result.status ?? 1;
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    process.exitCode = runTests(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
