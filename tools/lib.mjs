import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const reportsDir = path.join(root, 'reports');

export function ensureReports() {
  fs.mkdirSync(reportsDir, { recursive: true });
}

export function loadScript(relativePath, names) {
  const filename = path.join(root, relativePath);
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filename, 'utf8') + '\n' + names.map(name => 'window.' + name + '=' + name + ';').join('\n'), context, { filename });
  return Object.fromEntries(names.map(name => [name, context.window[name]]));
}

export function loadCatalog() {
  return loadScript('assets/js/fortune-catalog.js', ['FORTUNE_SYSTEMS']).FORTUNE_SYSTEMS;
}

export function loadOfficial() {
  const catalog = loadCatalog();
  return catalog.map(system => {
    const data = loadScript(system.dataFile, [system.globalName])[system.globalName];
    return { system, items: Array.from(data) };
  });
}

export function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

export function writeJson(filename, value) {
  ensureReports();
  fs.writeFileSync(path.join(reportsDir, filename), JSON.stringify(value, null, 2) + '\n', 'utf8');
}

export function writeText(filename, value) {
  ensureReports();
  fs.writeFileSync(path.join(reportsDir, filename), value, 'utf8');
}

export function collectRefs(item) {
  return [
    ...(item.sourceRefs || []),
    ...(item.traditionalText?.sourceRefs || []),
    ...(item.story?.sourceRefs || []),
    ...(item.plainMeaning?.evidenceRefs || [])
  ];
}

export function finish(report) {
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== 'PASS') process.exitCode = 1;
}
