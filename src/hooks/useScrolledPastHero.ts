import { useEffect, useState } from 'react';

// Zone 1（ヒーローのカード）を抜けたかどうか。
// 常駐する要素（HUD・Rail）が必ず同じタイミングで現れるよう、
// 判定をここに一本化している。
export function useScrolledPastHero() {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return past;
}
