// ビルド時に外部データを取得して静的JSONとして保存するスクリプト
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// SSL証明書検証の問題を回避（ローカル環境のみ）
// 注意: 本番CI/CDではこの設定は不要なことが多い
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, '../src/data');

// 設定
const NOTE_RSS_URL = 'https://note.com/yukagil/rss';
const MICROCMS_API_URL = 'https://yukagil.microcms.io/api/v1/articles?limit=100';

// リトライ設定
const MAX_RETRIES = 4;
const BASE_DELAY_MS = 800;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 環境変数からAPIキーを取得
function getApiKey() {
  if (process.env.MICROCMS_API_KEY) {
    return process.env.MICROCMS_API_KEY;
  }

  try {
    const envPath = resolve(__dirname, '../.env');
    if (existsSync(envPath)) {
      const envContent = readFileSync(envPath, 'utf-8');
      const match = envContent.match(/MICROCMS_API_KEY=(.+)/);
      if (match) {
        return match[1].trim();
      }
    }
  } catch (e) {
    // ignore
  }

  return null;
}

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

// --- microCMS (Speaking & Interviews) ---
async function fetchMicroCMS() {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('MICROCMS_API_KEY not found. Set it in .env or environment variable.');
  }

  console.log('📡 Fetching data from microCMS...');

  const response = await fetchWithRetry(
    MICROCMS_API_URL,
    { headers: { 'X-MICROCMS-API-KEY': apiKey } },
    'microCMS'
  );

  const json = await response.json();

  if (!json.contents) {
    throw new Error('microCMS response had no `contents` field');
  }

  // --- 登壇 (Speaking) ---
  const speakings = json.contents
    .filter((content) => {
      if (Array.isArray(content.type)) {
        return content.type.some((t) => t === '登壇' || t?.name === '登壇');
      }
      return content.type === '登壇' || content.type?.name === '登壇';
    })
    .map((content) => {
      const dateStr = content.date || content.publishedAt;
      const dateObj = new Date(dateStr);
      const formattedDate = `${dateObj.getFullYear()}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${dateObj.getDate().toString().padStart(2, '0')}`;

      const imageUrl = content.eyecatch?.url || content.thumbnail?.url || content.image?.url || '';

      const relatedLinks = [];
      if (content.slideurl || content.slide_url) {
        relatedLinks.push({ label: 'Slides', url: content.slideurl || content.slide_url, type: 'slide' });
      }
      if (content.linkurl || content.report_url) {
        relatedLinks.push({ label: 'Report', url: content.linkurl || content.report_url, type: 'article' });
      }
      if (content.video_url) {
        relatedLinks.push({ label: 'Video', url: content.video_url, type: 'video' });
      }
      if (content.related_links && Array.isArray(content.related_links)) {
        content.related_links.forEach((link) => {
          relatedLinks.push({ label: link.label || 'Link', url: link.url, type: 'article' });
        });
      }

      return {
        id: content.id,
        date: formattedDate,
        event: content.where || content.event_name || content.publisher || 'Event',
        title: content.title,
        mainLink: content.linkurl || content.url || content.link || '#',
        relatedLinks,
        imageUrl,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  // --- インタビュー (Interviews) ---
  const interviews = json.contents
    .filter((content) => {
      if (Array.isArray(content.type)) {
        return content.type.some((t) => t === 'インタビュー' || t?.name === 'インタビュー');
      }
      return content.type === 'インタビュー' || content.type?.name === 'インタビュー';
    })
    .map((content) => {
      const dateStr = content.date || content.publishedAt;
      const dateObj = new Date(dateStr);
      const formattedDate = `${dateObj.getFullYear()}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${dateObj.getDate().toString().padStart(2, '0')}`;

      const imageUrl = content.eyecatch?.url || content.thumbnail?.url || content.image?.url || '';

      return {
        id: content.id,
        date: formattedDate,
        media: content.where || content.media || content.publisher || 'Media',
        title: content.title,
        link: content.linkurl || content.url || content.link || '#',
        imageUrl,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  if (speakings.length === 0 && interviews.length === 0) {
    throw new Error('microCMS returned zero speakings and zero interviews — refusing to overwrite existing data');
  }

  const speakingsPath = saveJson('speakings.json', speakings);
  const interviewsPath = saveJson('interviews.json', interviews);

  console.log(`✅ Successfully saved ${speakings.length} speakings to ${speakingsPath}`);
  console.log(`✅ Successfully saved ${interviews.length} interviews to ${interviewsPath}`);
}

// --- メイン処理 ---
async function main() {
  console.log('🚀 Starting data fetch...\n');

  ensureOutputDir();

  const results = await Promise.allSettled([fetchRSS(), fetchMicroCMS()]);
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
