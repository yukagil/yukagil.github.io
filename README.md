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
│   ├── App.tsx           # メインコンポーネント
│   ├── main.tsx          # エントリーポイント
│   ├── index.css         # グローバルスタイル
│   └── data/             # ビルド時生成される静的データ
│       ├── writings.json
│       ├── speakings.json
│       └── interviews.json
├── scripts/
│   └── fetch-data.js     # ビルド時データ取得スクリプト
├── public/
│   └── robots.txt        # クローラーブロック設定
└── .env                  # 環境変数（Git管理外）
```

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

