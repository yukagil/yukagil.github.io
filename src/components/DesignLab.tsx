import { useEffect, useState } from 'react';
import { Linkedin, NotebookPen } from 'lucide-react';
import profile from '../data/profile.json';

// ============================================================
// デザイン探索用の一時的な仕組み。
//
// - 見た目の切り替えは <html data-variant="..."> の CSS で行う（DOM は不変）。
//   プリレンダリング結果が変わらないので、クローラ／エージェント向けの
//   出力には一切影響しない。
// - パネルは ?lab を付けたときだけ出る。通常の来訪者には見えない。
// - 不要になったら Home.tsx の import と <DesignLab /> を消し、
//   index.css の「Design variants」ブロックを削れば完全に消える。
// ============================================================

export type Variant = 'base' | 'menu' | 'console' | 'hud';

const VARIANTS: { id: Variant; label: string; note: string }[] = [
  { id: 'base', label: 'Base', note: '現状。比較の基準' },
  { id: 'menu', label: 'Menu', note: 'ゲームメニュー。選べるものとして並べる' },
  { id: 'console', label: 'Console', note: 'ステータス画面。カード裏の語彙を本文へ' },
  { id: 'hud', label: 'HUD', note: 'Zone 1 が縮んで常駐する' },
];

const STORAGE_KEY = 'design-variant';

// HUD に出す連絡先。肩書きは Zone 1 で読めているので繰り返さず、
// スクロール後に「連絡できる」ことだけを常駐させる
const HUD_LINKS = [
  {
    label: 'X',
    href: profile.socials.twitter,
    icon: (
      <img
        src="https://abs.twimg.com/responsive-web/client-web/icon-svg.ea5ff4aa.svg"
        alt=""
        className="w-4 h-4"
      />
    ),
  },
  { label: 'LinkedIn', href: profile.socials.linkedin, icon: <Linkedin size={16} /> },
  { label: 'note', href: profile.socials.note, icon: <NotebookPen size={16} /> },
  {
    label: 'YOUTRUST',
    href: profile.socials.youtrust,
    icon: (
      <img
        src="https://daxgddo8oz9ps.cloudfront.net/assets/common/favicon-f68a538cb715f05c5bcda84989832063f19220d53cf957de83385ca7ba3d9abc.png"
        alt=""
        className="w-4 h-4 grayscale"
      />
    ),
  },
];

export default function DesignLab() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<Variant>('base');
  const [open, setOpen] = useState(true);

  // 起動判定はクライアントのみ。localStorage を初期値として読むと
  // サーバー出力（常に base）と食い違ってハイドレーションが壊れるため、
  // 意図的にマウント後まで遅らせている。
  useEffect(() => {
    const hasFlag = window.location.search.includes('lab');
    const stored = window.localStorage.getItem(STORAGE_KEY) as Variant | null;
    if (!hasFlag && !stored) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    if (stored) setVariant(stored);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.dataset.variant = variant;
    window.localStorage.setItem(STORAGE_KEY, variant);
  }, [enabled, variant]);

  if (!enabled) return null;

  return (
    <>
      {variant === 'hud' && <ScrollHud />}

      <div
        className="fixed z-[200] font-mono"
        style={{ right: '16px', bottom: '16px' }}
      >
        {open ? (
          <div
            className="rounded-xl overflow-hidden shadow-lg"
            style={{ backgroundColor: '#fff', border: '1px solid var(--color-border-strong)', width: '208px' }}
          >
            <div
              className="flex items-center justify-between px-3 py-2"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <span className="text-xs font-bold">design lab</span>
              <button
                onClick={() => setOpen(false)}
                className="text-xs px-1 cursor-pointer"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label="パネルを閉じる"
              >
                －
              </button>
            </div>

            <div className="p-2 flex flex-col gap-1">
              {VARIANTS.map((v) => {
                const active = v.id === variant;
                return (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v.id)}
                    title={v.note}
                    className="text-left px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                    style={
                      active
                        ? { backgroundColor: 'var(--color-accent)', color: '#fff', fontWeight: 700 }
                        : { color: 'var(--color-text)' }
                    }
                  >
                    {v.label}
                    <span
                      className="block text-[10px] leading-tight mt-0.5"
                      style={{ color: active ? 'rgba(255,255,255,0.8)' : 'var(--color-text-muted)' }}
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
              style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
            >
              ラボを終了して通常表示に戻す
            </button>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="rounded-full px-3 py-2 text-xs font-bold shadow-lg cursor-pointer"
            style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
          >
            lab: {variant}
          </button>
        )}
      </div>
    </>
  );
}

// Zone 1 を通り過ぎたら現れる小さな常駐バー（HUD バリアント専用）
function ScrollHud() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[150] transition-all duration-300"
      style={{
        transform: shown ? 'translateY(0)' : 'translateY(-100%)',
        opacity: shown ? 1 : 0,
        backgroundColor: 'rgba(250,249,247,0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="max-w-[640px] mx-auto px-4 py-2 flex items-center gap-3">
        <img
          src={profile.imageUrl}
          alt=""
          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
          style={{ border: '1.5px solid var(--color-border-strong)' }}
        />
        <p className="text-sm font-bold leading-tight flex-1 min-w-0 truncate">{profile.name}</p>

        <div className="flex items-center gap-1 flex-shrink-0">
          {HUD_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={l.label}
              className="p-1.5 rounded-lg transition-colors press-in"
              style={{ color: 'var(--color-text)' }}
            >
              {l.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
