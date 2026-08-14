import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ビルド時の日付を埋め込む
// クライアントビルドと SSR ビルドは別プロセスなので、値がずれてハイドレーション不整合に
// ならないよう、先に走った側が BUILD_TIMESTAMP を env に置いて共有する
const buildTimestamp = process.env.BUILD_TIMESTAMP
  ? new Date(Number(process.env.BUILD_TIMESTAMP))
  : new Date();

const buildDate = buildTimestamp.toLocaleDateString('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).replace(/\//g, '.');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
    __BUILD_YEAR__: JSON.stringify(buildTimestamp.getFullYear()),
  },
  // GitHub Pages用の設定
  // ユーザーサイト (username.github.io) の場合は '/' のままでOK
  // プロジェクトサイト (username.github.io/repo-name) の場合は '/repo-name/' に変更
  base: '/',
})
