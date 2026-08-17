import { useEffect, useState } from 'react';
import { useScrolledPastHero } from '../hooks/useScrolledPastHero';
import { onScrollAll } from '../hooks/useScroller';

// 広い画面で、右に現在地を示す固定ナビ。
// ラベルは見出しと同じ英語のまま。ここは「いまどこにいるか」を
// 見出しと対応させて示すインジケータで、メニュー（コマンド窓）とは
// 役割が違う。
// Zone 1（ヒーロー）では出さず、HUD と同じタイミングで現れる。
export default function SectionRail() {
  const shown = useScrolledPastHero();
  // 見出しは DOM を測って得るしかないので、マウント後に読む。
  // 現在地とまとめて1つの state にしている
  const [state, setState] = useState<{ sections: string[]; active: string }>({
    sections: [],
    active: '',
  });

  useEffect(() => {
    const read = () => {
      const headings = Array.from(document.querySelectorAll<HTMLElement>('main section > h2'));
      let active = '';
      for (const h of headings) {
        if (h.getBoundingClientRect().top < window.innerHeight * 0.35) {
          active = h.textContent?.trim() ?? '';
        }
      }
      setState({ sections: headings.map((h) => h.textContent?.trim() ?? ''), active });
    };
    read();
    return onScrollAll(read);
  }, []);

  const jump = (name: string) => {
    const target = Array.from(document.querySelectorAll<HTMLElement>('main section > h2')).find(
      (h) => h.textContent?.trim() === name
    );
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className="fixed z-[140] hidden xl:block transition-opacity duration-300"
      style={{
        right: 'calc(50% - 520px)',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: shown ? 1 : 0,
        pointerEvents: shown ? 'auto' : 'none',
      }}
      aria-hidden={!shown}
      aria-label="セクション"
    >
      <ul className="list-none flex flex-col gap-2 items-end">
        {state.sections.map((name) => {
          const active = state.active === name;
          return (
            <li key={name}>
              <button
                onClick={() => jump(name)}
                className="flex flex-row-reverse items-center gap-2 font-mono text-xs transition-colors cursor-pointer"
                style={{ color: active ? 'var(--color-text)' : 'var(--color-text-muted)' }}
              >
                <span
                  className="inline-block rounded-sm transition-all"
                  style={{
                    width: active ? '14px' : '6px',
                    height: '2px',
                    backgroundColor: active ? 'var(--color-accent)' : 'var(--color-border)',
                  }}
                />
                {name}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
