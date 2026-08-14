# Portfolio

Yuta Kanehara のポートフォリオサイト

🔗 **Live Site**: https://yukagil.github.io

## 技術スタック

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Hosting**: GitHub Pages

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env` ファイルを作成し、microCMS APIキーを設定：
```env
MICROCMS_API_KEY=your_api_key_here
```

### 3. 開発サーバーの起動
```bash
npm run dev
```

## ビルド & デプロイ

### ローカルビルド
```bash
npm run build
```

`npm run build` は次の順に走る:

1. `fetch-data` — note RSS / microCMS から実績データを取得
2. `gen-agent-assets` — llms.txt / sitemap.xml / public/data/*.json を生成
3. `tsc -b` — 型チェック
4. `vite build` — クライアントバンドル
5. `vite build --ssr` — SSR バンドル
6. `prerender` — SSR 結果を dist/index.html の `#root` に焼き込む

### データ取得のみ実行
```bash
npm run fetch-data
```

### GitHub Pagesへデプロイ
```bash
npm run deploy
```

## プロジェクト構成

```
my-portfolio/
├── src/
│   ├── App.tsx             # ルーティング
│   ├── Home.tsx            # ページ本体
│   ├── main.tsx            # クライアントエントリ（ハイドレーション）
│   ├── entry-server.tsx    # SSR エントリ（プリレンダリング用）
│   ├── index.css           # グローバルスタイル
│   ├── components/SEO.tsx  # 構造化データ(JSON-LD) + meta タグ
│   └── data/
│       ├── profile.json    # ★手動管理。プロフィール/経歴/サービスの正
│       ├── writings.json   # 以下はビルド時に自動取得
│       ├── speakings.json
│       ├── interviews.json
│       └── qabox.json
├── scripts/
│   ├── fetch-data.js        # 外部データ取得
│   ├── gen-agent-assets.js  # llms.txt / sitemap.xml / public/data/*.json 生成
│   └── prerender.js         # dist/index.html に本文を焼き込む
├── public/
│   ├── robots.txt
│   ├── llms.txt             # 自動生成（直接編集しない）
│   ├── sitemap.xml          # 自動生成（直接編集しない）
│   └── data/                # 自動生成（直接編集しない）
└── .env                     # 環境変数（Git管理外）
```

## エージェント対応について

JS を実行しないクローラ／AIエージェントにもコンテンツが届くよう、以下を用意している。

| 出力 | 内容 |
|---|---|
| `dist/index.html` | ビルド時に SSR して本文を焼き込み済み。JS なしで全文が読める |
| `/llms.txt` | サイト全体の要約（Markdown）。経歴・登壇・執筆・連絡先を1枚に |
| `/sitemap.xml` | サイトマップ |
| `/data/*.json` | 実績データの機械可読エンドポイント（ISO 日付付き） |
| JSON-LD | `Person` / `ProfilePage` / `ItemList(Article, Event)` / `Service` を静的出力 |

### 内容を更新するとき

プロフィール・経歴・提供サービスは **`src/data/profile.json` が唯一の正**。
ここを直せば、ページ表示・JSON-LD・llms.txt のすべてに反映される。

### 実装上の注意

- **`prefers-reduced-motion` や `window` をレンダリング中に参照しない。**
  サーバー側では常に未定義扱いになるため、ハイドレーション不整合を起こす。
  参照する場合は `useEffect` で state に入れること（`ParticleBackground.tsx` 参照）
- 日付など時刻に依存する値は `__BUILD_DATE__` / `__BUILD_YEAR__` を使う。
  `new Date()` を直接描画するとビルド時と閲覧時でずれる
- 実績リストは**全件を DOM に出し**、`hidden` 属性で折りたたむ。
  `slice()` で間引くとエージェントから見えなくなる

## 開発メモ

### SSL証明書エラーの回避
ローカル環境でのビルド時にSSL証明書エラーが発生する場合、`fetch-data.js` で以下を設定：
```js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
```
※本番CI/CDでは通常この設定は不要

### データ更新
記事や登壇実績を更新するには、再ビルド＆デプロイを実行：
```bash
npm run deploy
```

## ライセンス

© 2026 Yuta Kanehara. All rights reserved.

