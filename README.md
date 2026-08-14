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

### 2. 開発サーバーの起動
```bash
npm run dev
```

APIキーなどの環境変数は不要。取得先は note の公開 RSS だけになっている。

## ビルド & デプロイ

### ローカルビルド
```bash
npm run build
```

`npm run build` は次の順に走る:

1. `fetch-data` — note RSS から執筆記事、質問箱の OGP を取得
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
│       ├── profile.json     # ★手動。プロフィール/経歴/サービス/紹介文の正
│       ├── speakings.json   # ★手動。登壇実績
│       ├── interviews.json  # ★手動。取材記事
│       ├── writings.json    # 自動。note RSS から取得
│       └── qabox.json       # 自動。質問箱の OGP
├── scripts/
│   ├── fetch-data.js        # note RSS / 質問箱 OGP の取得
│   ├── gen-agent-assets.js  # llms.txt / sitemap.xml / public/data/*.json 生成
│   └── prerender.js         # dist/index.html に本文を焼き込む
├── public/
│   ├── images/              # 登壇・取材のサムネイルとアバター（自前ホスト）
│   ├── robots.txt
│   ├── llms.txt             # 自動生成（直接編集しない）
│   ├── sitemap.xml          # 自動生成（直接編集しない）
│   └── data/                # 自動生成（直接編集しない）
└── (.env は不要。外部APIキーを使わなくなった)
```

## コンテンツの追加・更新

| 更新したいもの | 編集する場所 |
|---|---|
| プロフィール、経歴、提供サービス、紹介文3種 | `src/data/profile.json` |
| 登壇実績 | `src/data/speakings.json` |
| 取材記事 | `src/data/interviews.json` |
| 執筆記事 | note に投稿すれば次のビルドで自動反映 |

登壇・取材は以前 microCMS から取得していたが、更新が年3〜4件しかなく CMS が
割に合わなかったため、JSON の直接編集に移行した。画像も `public/images/` に
自前ホストしている（外部サービスが消えてもリンクが切れない）。

`speakings.json` / `interviews.json` の `summary` は「何の話だったか」を
45〜55字で書く。表示・JSON-LD の `description`・llms.txt の3箇所に反映される。

## エージェント対応について

JS を実行しないクローラ／AIエージェントにもコンテンツが届くよう、以下を用意している。

| 出力 | 内容 |
|---|---|
| `dist/index.html` | ビルド時に SSR して本文を焼き込み済み。JS なしで全文が読める |
| `/llms.txt` | サイト全体の要約（Markdown）。経歴・登壇・執筆・連絡先を1枚に |
| `/sitemap.xml` | サイトマップ |
| `/data/*.json` | 実績データの機械可読エンドポイント（ISO 日付付き） |
| JSON-LD | `Person` / `ProfilePage` / `ItemList(Article, Event)` / `Service` を静的出力 |

### 実装上の注意

- **`prefers-reduced-motion` や `window` をレンダリング中に参照しない。**
  サーバー側では常に未定義扱いになるため、ハイドレーション不整合を起こす。
  参照する場合は `useEffect` で state に入れること（`ParticleBackground.tsx` 参照）
- 日付など時刻に依存する値は `__BUILD_DATE__` / `__BUILD_YEAR__` を使う。
  `new Date()` を直接描画するとビルド時と閲覧時でずれる
- 実績リストは**全件を DOM に出し**、`hidden` 属性で折りたたむ。
  `slice()` で間引くとエージェントから見えなくなる

### 内容を反映するには

JSON を編集したあと、再ビルド＆デプロイを実行する：
```bash
npm run deploy
```

## ライセンス

© 2026 Yuta Kanehara. All rights reserved.

