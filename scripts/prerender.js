// ビルド後に SSR バンドルを読み込み、dist/index.html の #root に本文を焼き込む。
// JS を実行しないクローラ／エージェントが取得した時点で全コンテンツが読める状態にするためのもの。
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TEMPLATE_PATH = resolve(ROOT, 'dist/index.html');
const SSR_ENTRY = resolve(ROOT, 'dist-ssr/entry-server.js');

const ROOT_DIV = '<div id="root"></div>';

function fail(message) {
  console.error(`✗ prerender: ${message}`);
  process.exit(1);
}

if (!existsSync(TEMPLATE_PATH)) fail(`dist/index.html が見つかりません。先に vite build を実行してください`);
if (!existsSync(SSR_ENTRY)) fail(`dist-ssr/entry-server.js が見つかりません。先に vite build --ssr を実行してください`);

const template = readFileSync(TEMPLATE_PATH, 'utf-8');
if (!template.includes(ROOT_DIV)) {
  fail(`dist/index.html に ${ROOT_DIV} が見つかりません（index.html の構造が変わった可能性があります）`);
}

const { render } = await import(pathToFileURL(SSR_ENTRY).href);

let html;
try {
  html = render('/');
} catch (e) {
  fail(`レンダリングに失敗しました: ${e.stack || e.message}`);
}

if (!html || html.length < 500) {
  fail(`レンダリング結果が短すぎます（${html?.length ?? 0} 文字）。SSR が正しく動いていない可能性があります`);
}

writeFileSync(TEMPLATE_PATH, template.replace(ROOT_DIV, `<div id="root">${html}</div>`));

console.log(`✓ prerender: dist/index.html に ${html.length.toLocaleString()} 文字を埋め込みました`);
