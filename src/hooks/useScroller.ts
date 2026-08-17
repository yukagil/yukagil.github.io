import { useEffect, useState } from 'react';

// スクロールするのはウィンドウではなく #root。
// 枠（筐体）を html の背景として絶対に動かないようにするため、
// スクロール領域を画面に固定した #root の内側へ移してある。
export function getScroller(): HTMLElement | null {
  return document.getElementById('root');
}

export function scrollToTop() {
  getScroller()?.scrollTo({ top: 0, behavior: 'instant' });
}

// スクロールを監視して値を返す。
//
// scroll イベントは発生元の要素でしか捕まらないので、コンテナ・window・
// document のすべてに登録している。将来スクロールする層が変わっても
// 追随が壊れないようにするため（実際、window から #root へ移している）。
export function useScrollValue<T>(read: (el: HTMLElement) => T, initial: T): T {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    const el = getScroller();
    if (!el) return;

    const onScroll = () => setValue(read(el));
    onScroll();

    const targets: (HTMLElement | Window | Document)[] = [el, window, document];
    targets.forEach((t) => t.addEventListener('scroll', onScroll, { passive: true }));
    window.addEventListener('resize', onScroll);

    return () => {
      targets.forEach((t) => t.removeEventListener('scroll', onScroll));
      window.removeEventListener('resize', onScroll);
    };
    // read は毎レンダリング新しい関数になるので依存に入れない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}

// スクロール中に毎回 DOM を測りたいコンポーネント用。
// 上と同じ理由で3か所に登録する。
export function onScrollAll(handler: () => void): () => void {
  const el = getScroller();
  const targets: (HTMLElement | Window | Document)[] = [window, document];
  if (el) targets.unshift(el);
  targets.forEach((t) => t.addEventListener('scroll', handler, { passive: true }));
  window.addEventListener('resize', handler);
  return () => {
    targets.forEach((t) => t.removeEventListener('scroll', handler));
    window.removeEventListener('resize', handler);
  };
}
