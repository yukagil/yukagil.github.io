import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';

// ビルド時プリレンダリング用のエントリ。
// scripts/prerender.js から呼ばれ、生成した HTML を dist/index.html の #root に流し込む。
// これにより JS を実行しないクローラ／エージェントにも本文が届く。
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}
