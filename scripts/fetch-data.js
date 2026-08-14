// ビルド時に外部データを取得して静的JSONとして保存するスクリプト。
//
// 取得するのは note RSS（執筆記事）と質問箱の OGP だけ。
// 登壇・取材は src/data/{speakings,interviews}.json を手で編集する
// （microCMS から移行済み。年3〜4件の更新に CMS は割に合わなかった）
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, '../src/data');

// 設定
const NOTE_RSS_URL = 'https://note.com/yukagil/rss';
const QABOX_URL = 'https://note.com/qa/yukagil';

// リトライ設定
const MAX_RETRIES = 4;
const BASE_DELAY_MS = 800;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 出力ディレクトリを確保
function ensureOutputDir() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

// JSONファイルとして保存
function saveJson(filename, data) {
  const outputPath = resolve(OUTPUT_DIR, filename);
  writeFileSync(outputPath, JSON.stringify(data, null, 2));
  return outputPath;
}

// fetch + 指数バックオフリトライ
async function fetchWithRetry(url, options = {}, label = url) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        // 404 など 4xx は呼び出し側に判断させる（ページネーション終端など）
        const err = new Error(`HTTP ${response.status} ${response.statusText}`);
        err.status = response.status;
        err.response = response;
        throw err;
      }
      return response;
    } catch (e) {
      lastError = e;
      // 4xx の一部はリトライしても無駄なので即座に投げる
      if (e.status && e.status >= 400 && e.status < 500 && e.status !== 408 && e.status !== 429) {
        throw e;
      }
      if (attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        console.warn(`   ⚠️ ${label} attempt ${attempt}/${MAX_RETRIES} failed: ${e.message}. Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  throw new Error(`${label} failed after ${MAX_RETRIES} attempts: ${lastError.message}`);
}

// --- OGP (質問箱) ---
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;/gi, "'");
}

function extractMeta(html, key) {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`, 'i'),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return decodeEntities(m[1]).trim();
  }
  return '';
}

async function fetchQaBox() {
  console.log('📡 Fetching OGP for 質問箱...');

  const response = await fetchWithRetry(
    QABOX_URL,
    { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBuild/1.0)' } },
    '質問箱 OGP'
  );

  const html = await response.text();
  const data = {
    title: extractMeta(html, 'og:title'),
    description: extractMeta(html, 'og:description'),
    image: extractMeta(html, 'og:image'),
    url: extractMeta(html, 'og:url') || QABOX_URL,
    siteName: extractMeta(html, 'og:site_name'),
  };

  if (!data.image || !data.title) {
    throw new Error('質問箱 OGP missing required og:image/og:title');
  }

  const outputPath = saveJson('qabox.json', data);
  console.log(`✅ Successfully saved 質問箱 OGP to ${outputPath}`);
}

// --- RSS (note.com) ---
async function fetchRSS() {
  console.log('📡 Fetching RSS data from note.com...');

  const allWritings = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = page === 1 ? NOTE_RSS_URL : `${NOTE_RSS_URL}?page=${page}`;
    console.log(`   Fetching page ${page}...`);

    let response;
    try {
      response = await fetchWithRetry(
        url,
        { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBuild/1.0)' } },
        `RSS page ${page}`
      );
    } catch (e) {
      // 2ページ目以降の 404 はページネーション終端として扱う
      if (page > 1 && e.status === 404) {
        hasMore = false;
        break;
      }
      // 1ページ目の失敗は致命的
      throw new Error(`RSS fetch failed on page ${page}: ${e.message}`);
    }

    const xmlText = await response.text();
    const writings = parseRSS(xmlText, page === 1 ? 0 : allWritings.length);

    if (writings.length === 0) {
      hasMore = false;
      break;
    }

    allWritings.push(...writings);

    if (writings.length < 20) {
      hasMore = false;
    } else {
      page++;
      if (page > 100) {
        console.log('⚠️ Reached maximum page limit (100)');
        hasMore = false;
      }
    }
  }

  if (allWritings.length === 0) {
    throw new Error('RSS fetch returned zero items — refusing to overwrite existing data');
  }

  const outputPath = saveJson('writings.json', allWritings);
  console.log(`✅ Successfully saved ${allWritings.length} articles to ${outputPath}`);
}

function parseRSS(xmlText, startIndex = 0) {
  const writings = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title>([\s\S]*?)<\/title>/;
  const linkRegex = /<link>([\s\S]*?)<\/link>/;
  const pubDateRegex = /<pubDate>([\s\S]*?)<\/pubDate>/;

  const mediaPatterns = [
    /<media:thumbnail>([^<]+)<\/media:thumbnail>/,
    /<media:thumbnail[^>]*url=["']([^"']+)["']/,
    /<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image/,
  ];

  let match;
  let index = startIndex;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];

    const titleMatch = itemContent.match(titleRegex);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '').trim() : '';

    const linkMatch = itemContent.match(linkRegex);
    const link = linkMatch ? linkMatch[1].trim() : '';

    const pubDateMatch = itemContent.match(pubDateRegex);
    let formattedDate = '';
    if (pubDateMatch) {
      const dateObj = new Date(pubDateMatch[1]);
      formattedDate = `${dateObj.getFullYear()}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${dateObj.getDate().toString().padStart(2, '0')}`;
    }

    let imageUrl = '';
    for (const pattern of mediaPatterns) {
      const mediaMatch = itemContent.match(pattern);
      if (mediaMatch && mediaMatch[1]) {
        imageUrl = mediaMatch[1];
        break;
      }
    }

    if (title && link) {
      writings.push({
        id: `rss-${index}`,
        title,
        source: 'note',
        date: formattedDate,
        link,
        imageUrl,
      });
      index++;
    }
  }

  writings.sort((a, b) => (a.date < b.date ? 1 : -1));
  return writings;
}

// --- メイン処理 ---
async function main() {
  console.log('🚀 Starting data fetch...\n');

  ensureOutputDir();

  // 質問箱OGPは任意データ。失敗してもビルドは止めず、既存JSONを保持する。
  try {
    await fetchQaBox();
  } catch (e) {
    console.warn(`⚠️ 質問箱 OGP fetch failed: ${e.message}. Existing qabox.json preserved.`);
  }

  const results = await Promise.allSettled([fetchRSS()]);
  const failures = results.filter((r) => r.status === 'rejected');

  if (failures.length > 0) {
    console.error('\n❌ Data fetch failed:');
    failures.forEach((f) => console.error(`   - ${f.reason?.message ?? f.reason}`));
    console.error('\n   Existing data files were preserved. Build aborted.');
    process.exit(1);
  }

  console.log('\n✨ Data fetch complete!');
}

main();
