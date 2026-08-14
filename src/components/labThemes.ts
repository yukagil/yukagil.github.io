// 探索用の主題分類（草案）。
// いまサイトは「形式」で分かれている（Speaking / Writings / Interviews）が、
// これは CMS のフィールド設計であって読み手の関心ではない。
// 実物を分類すると主題が5本あり、最大の塊は「大企業の変革と内製化」で
// 全体の3割を占める。サイトはそれを一度も言っていない。
//
// 採用が決まったら src/data 側に theme フィールドとして持たせる。

export type ThemeId = 'transform' | 'org' | 'politics' | 'craft' | 'ai' | 'misc';

export const THEMES: { id: ThemeId; label: string; lead: string }[] = [
  {
    id: 'transform',
    label: '大企業の変革と内製化',
    lead: '成功してきた仕組みが変化を妨げる。その構造をどう解くか。',
  },
  {
    id: 'org',
    label: '組織づくりと測定',
    lead: 'チーム単位ではなく、経営・意思決定・育成まで含めて設計する。',
  },
  {
    id: 'politics',
    label: '意思決定と社内政治',
    lead: '正しさだけでは動かない。決まる場をどう作るか。',
  },
  {
    id: 'craft',
    label: 'プロダクトマネジメントの型',
    lead: '課題・要求・優先度をどう扱うかという、日々の道具の話。',
  },
  { id: 'ai', label: 'AI時代の役割', lead: '速く安く作れる時代に、人は何をするのか。' },
  { id: 'misc', label: 'その他', lead: '' },
];

// id -> 主題
export const THEME_OF: Record<string, ThemeId> = {
  // Speaking
  'cnoxxgdu2h70': 'transform',
  '6c-kasdnx-tz': 'transform',
  '3212cypml3o': 'transform',
  'fommzfrc9x0': 'transform',
  'v018t8fl1o': 'transform',
  'ssu28_djpk': 'org',
  'hn2_z4v098': 'org',
  'czzwms8dce': 'org',
  '1f2ay-asxq3': 'politics',
  '8ivt51be8': 'ai',
  // Interviews
  'qhh575txlwr': 'transform',
  'snrh8lyip3': 'org',
  '453wskql7i': 'org',
  // Writings
  'rss-0': 'transform',
  'rss-3': 'transform',
  'rss-4': 'transform',
  'rss-8': 'transform',
  'rss-1': 'politics',
  'rss-13': 'politics',
  'rss-14': 'politics',
  'rss-2': 'craft',
  'rss-7': 'craft',
  'rss-12': 'craft',
  'rss-15': 'craft',
  'rss-16': 'craft',
  'rss-9': 'ai',
  'rss-10': 'ai',
  'rss-5': 'misc',
  'rss-6': 'misc',
  'rss-11': 'misc',
  'rss-17': 'misc',
};

// Canon: 「まずこれを」の3本（草案）。
// 主題の最大の塊から、話・記事・取材を1本ずつ選んでいる
export const CANON = ['cnoxxgdu2h70', 'qhh575txlwr', 'rss-0'];
