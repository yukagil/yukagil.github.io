import { useEffect, useState } from 'react';
import { useScrolledPastHero } from '../hooks/useScrolledPastHero';

// ============================================================
// デザイン探索用の一時的な仕組み。
//
// - 切り替えは <html data-variant="..."> の CSS。プリレンダリング結果は
//   常に素の状態なので、クローラ／エージェント向け出力に影響しない。
// - パネルは ?lab を付けたときだけ出る。
// - 採用が決まった案はここから消して通常スタイルへ昇格させ、
//   却下された案も消す（残すと選択肢が濁る）。
//   昇格済み: Menu / HUD ・ 却下: Console / Timeline / Sheet /
//   Dark / Mincho / Paper / Wide
// - 不要になったら Home.tsx の import と <DesignLab /> を消し、
//   index.css の「Design variants」ブロックを削れば完全に消える。
// ============================================================

export type Variant = 'base' | 'rail';

const VARIANTS: { id: Variant; label: string; note: string }[] = [
  { id: 'base', label: 'Base', note: '現状（Menu + HUD 反映済み）' },
  { id: 'rail', label: 'Rail', note: '右に現在地を示すナビ。HUD と一緒に現れる' },
];

const STORAGE_KEY = 'design-variant';

export default function DesignLab() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<Variant>('base');
  const [open, setOpen] = useState(true);

  // 起動判定はクライアントのみ。localStorage を初期値として読むと
  // サーバー出力と食い違ってハイドレーションが壊れるため、意図的に
  // マウント後まで遅らせている。
  useEffect(() => {
    const hasFlag = window.location.search.includes('lab');
    const stored = window.localStorage.getItem(STORAGE_KEY) as Variant | null;
    const known = VARIANTS.some((v) => v.id === stored);
    if (!hasFlag && !known) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    if (known && stored) setVariant(stored);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.dataset.variant = variant;
    window.localStorage.setItem(STORAGE_KEY, variant);
  }, [enabled, variant]);

  if (!enabled) return null;

  return (
    <>
      {variant === 'rail' && <SectionRail />}

      <div className="fixed z-[200] font-mono" style={{ right: '16px', bottom: '16px' }}>
        {open ? (
          <div
            className="rounded-xl overflow-hidden shadow-lg"
            style={{
              backgroundColor: '#fff',
              border: '1px solid #2C2A25',
              color: '#2C2A25',
              width: '212px',
            }}
          >
            <div
              className="flex items-center justify-between px-3 py-2"
              style={{ borderBottom: '1px solid #D8D6D0' }}
            >
              <span className="text-xs font-bold">design lab</span>
              <button
                onClick={() => setOpen(false)}
                className="text-xs px-1 cursor-pointer"
                style={{ color: '#6E6C64' }}
                aria-label="パネルを閉じる"
              >
                －
              </button>
            </div>

            <div className="p-2 flex flex-col gap-0.5">
              {VARIANTS.map((v) => {
                const active = v.id === variant;
                return (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v.id)}
                    className="text-left px-2 py-1.5 rounded-lg text-xs cursor-pointer"
                    style={
                      active
                        ? { backgroundColor: '#D03530', color: '#fff', fontWeight: 700 }
                        : { color: '#2C2A25' }
                    }
                  >
                    {v.label}
                    <span
                      className="block text-[10px] leading-tight mt-0.5"
                      style={{ color: active ? 'rgba(255,255,255,0.85)' : '#6E6C64' }}
                    >
                      {v.note}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                window.localStorage.removeItem(STORAGE_KEY);
                delete document.documentElement.dataset.variant;
                setEnabled(false);
              }}
              className="w-full px-3 py-2 text-[10px] cursor-pointer"
              style={{ borderTop: '1px solid #D8D6D0', color: '#6E6C64' }}
            >
              ラボを終了して通常表示に戻す
            </button>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="rounded-full px-3 py-2 text-xs font-bold shadow-lg cursor-pointer"
            style={{ backgroundColor: '#D03530', color: '#fff' }}
          >
            lab: {variant}
          </button>
        )}
      </div>
    </>
  );
}

// ============================================================
// Rail — 右に現在地を示す固定ナビ。
// Zone 1（ヒーロー）では出さず、HUD と同じタイミングで現れる。
// ============================================================

function SectionRail() {
  const shown = useScrolledPastHero();
  // 見出しは DOM を測って得るしかないので、マウント後に一度だけ読む。
  // 現在地とまとめて1つの state にしている
  const [state, setState] = useState<{ sections: string[]; active: string }>({
    sections: [],
    active: '',
  });

  useEffect(() => {
    const read = () => {
      const headings = Array.from(
        document.querySelectorAll<HTMLElement>('main section > h2')
      );
      let active = '';
      for (const h of headings) {
        if (h.getBoundingClientRect().top < window.innerHeight * 0.35) {
          active = h.textContent?.trim() ?? '';
        }
      }
      setState({ sections: headings.map((h) => h.textContent?.trim() ?? ''), active });
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, []);

  const { sections, active } = state;

  const jump = (name: string) => {
    const target = Array.from(document.querySelectorAll('main section > h2')).find(
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
        {sections.map((name) => {
          const on = active === name;
          return (
            <li key={name}>
              <button
                onClick={() => jump(name)}
                className="flex flex-row-reverse items-center gap-2 font-mono text-xs transition-colors cursor-pointer"
                style={{ color: on ? 'var(--color-text)' : 'var(--color-text-muted)' }}
              >
                <span
                  className="inline-block rounded-sm transition-all"
                  style={{
                    width: on ? '14px' : '6px',
                    height: '2px',
                    backgroundColor: on ? 'var(--color-accent)' : 'var(--color-border)',
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
