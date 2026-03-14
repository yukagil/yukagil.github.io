import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ビルド時の日付を埋め込む
const buildDate = new Date().toLocaleDateString('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).replace(/\//g, '.');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  // GitHub Pages用の設定
  // ユーザーサイト (username.github.io) の場合は '/' のままでOK
  // プロジェクトサイト (username.github.io/repo-name) の場合は '/repo-name/' に変更
  base: '/',
})
