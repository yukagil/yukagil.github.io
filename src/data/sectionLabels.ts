// セクションの日本語ラベル。
//
// 見出し（EXPERIENCE 等）は英語のままにしてある。あれはコンテンツの
// ラベルであってコマンドではない。一方、Rail もメニューも「選んで移動する」
// ものなので日本語で書く。ゲームのメニューに英語は並ばない。
//
// 照合と移動には英語名（DOM の h2 テキスト）を使い、表示だけ差し替える。
export const SECTION_JA: Record<string, string> = {
  Experience: '経歴',
  Interviews: '取材',
  Speaking: '登壇',
  Writings: '執筆',
  Services: '支援',
  Contact: '連絡',
};

export const labelOf = (name: string) => SECTION_JA[name] ?? name;
