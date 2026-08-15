import { useEffect, useState } from 'react';
import { useScrolledPastHero } from '../hooks/useScrolledPastHero';

// 狭い画面向けのセクションメニュー。
// Rail（右の固定ナビ）は 1280px 以上でしか出ないので、それ未満を
// こちらが受け持つ。両方が同時に出ることはない。
//
// 呼び出せるメニューがあること自体がこのサイトの遊びなので、
// 見た目はコマンド窓の体裁にしている（▶ カーソル、等幅）。
export default function SectionMenu() {
  const pastHero = useScrolledPastHero();
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<string[]>([]);
  const [current, setCurrent] = useState('');

  useEffect(() => {
    const read = () => {
      const hs = Array.from(document.querySelectorAll<HTMLElement>('main section > h2'));
      setSections(hs.map((h) => h.textContent?.trim() ?? ''));
      let name = '';
      for (const h of hs) {
        if (h.getBoundingClientRect().top < window.innerHeight * 0.35) {
          name = h.textContent?.trim() ?? '';
        }
      }
      setCurrent(name);
    };
    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, []);

  // ヒーローに戻ったら畳む。state を戻すのではなく描画側で判定する
  const showPanel = open && pastHero;

  const jump = (name: string) => {
    Array.from(document.querySelectorAll<HTMLElement>('main section > h2'))
      .find((h) => h.textContent?.trim() === name)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  };

  return (
    <div className="xl:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="section-menu-trigger font-mono"
        aria-expanded={showPanel}
        aria-hidden={!pastHero}
        style={{
          opacity: pastHero ? 1 : 0,
          pointerEvents: pastHero ? 'auto' : 'none',
        }}
      >
        {showPanel ? '× とじる' : '≡ メニュー'}
      </button>

      {showPanel && (
        <nav className="section-menu font-mono" aria-label="セクション">
          <p className="section-menu-head">いどうする</p>
          <ul className="list-none">
            {sections.map((s) => (
              <li key={s}>
                <button onClick={() => jump(s)} className="section-menu-row" data-on={s === current}>
                  <span className="section-menu-cursor" aria-hidden="true">
                    ▶
                  </span>
                  <span className="flex-1 text-left">{s}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
