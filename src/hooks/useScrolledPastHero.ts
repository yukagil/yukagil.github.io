import { useScrollValue } from './useScroller';

// Zone 1（ヒーローのカード）を抜けたかどうか。
// 常駐する要素（HUD・Rail・メニュー）が必ず同じタイミングで現れるよう、
// 判定をここに一本化している。
export function useScrolledPastHero() {
  return useScrollValue((el) => el.scrollTop > el.clientHeight * 0.75, false);
}
