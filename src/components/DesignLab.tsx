import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import writings from '../data/writings.json';
import speakings from '../data/speakings.json';
import interviews from '../data/interviews.json';
import profile from '../data/profile.json';
import { THEMES, THEME_OF } from './labThemes';

// ============================================================
// デザイン探索用の一時的な仕組み。案は組み合わせて試せるトグル。
//
// この回はカード裏（Lv＝実年齢 / CLASS＝MBTI / STRENGTHS）と同じ
// 語彙を Zone 2 に持ち込む方向だけで作っている。
// これまで出したものは全部「サイトを立派にする」方向で、
// このサイトが持っている自己紹介をネタにする感覚に触れていなかった。
//
// - パネルは ?lab を付けたときだけ出る。
// - 昇格済み: Menu / HUD / Rail / Years
// - 不要になったら Home.tsx の import と <DesignLab /> を消し、
//   index.css の「Design lab」ブロックを削れば完全に消える。
// ============================================================

type Flag = 'skills' | 'command' | 'party' | 'encounter' | 'save' | 'levelup';

const FLAGS: { id: Flag; label: string; note: string }[] = [
  { id: 'skills', label: 'Skills', note: 'とくぎ欄。主題ごとの件数がそのまま Lv になる' },
  { id: 'command', label: 'Command', note: 'Contact を「▶ はなす」のコマンド窓に' },
  { id: 'party', label: 'Party', note: '経歴を「なかま」欄に。在籍年数が Lv' },
  { id: 'encounter', label: 'Encounter', note: 'セクションに入ると「◯◯があらわれた！」' },
  { id: 'save', label: 'Save', note: '再訪すると「おかえりなさい」。ぼうけんのしょ' },
  { id: 'levelup', label: 'LevelUp', note: '読み進むと Lv が上がる。年表を経験値にする' },
];

const STORAGE_KEY = 'design-lab-flags';

export default function DesignLab() {
  const [enabled, setEnabled] = useState(false);
  const [on, setOn] = useState<Flag[]>([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const hasFlag = window.location.search.includes('lab');
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!hasFlag && stored === null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    if (stored) {
      setOn(stored.split(' ').filter((f): f is Flag => FLAGS.some((x) => x.id === f)));
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.dataset.lab = on.join(' ');
    window.localStorage.setItem(STORAGE_KEY, on.join(' '));
  }, [enabled, on]);

  if (!enabled) return null;

  const toggle = (f: Flag) =>
    setOn((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  return (
    <>
      {on.includes('skills') && <SkillPanel />}
      {on.includes('command') && <CommandWindow />}
      {on.includes('party') && <PartyList />}
      {on.includes('encounter') && <SectionEncounter />}
      {on.includes('save') && <SaveFile />}
      {on.includes('levelup') && <LevelUp />}

      <div className="fixed z-[200] font-mono" style={{ right: '16px', bottom: '16px' }}>
        {open ? (
          <div
            className="rounded-xl shadow-lg flex flex-col"
            style={{
              backgroundColor: '#fff',
              border: '1px solid #2C2A25',
              color: '#2C2A25',
              width: '240px',
              maxHeight: 'min(72vh, 560px)',
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
              style={{ borderBottom: '1px solid #D8D6D0' }}
            >
              <span className="text-xs font-bold flex-1">design lab</span>
              <span className="text-[10px]" style={{ color: '#6E6C64' }}>
                {on.length}/{FLAGS.length}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-xs px-1 cursor-pointer"
                style={{ color: '#6E6C64' }}
                aria-label="パネルを閉じる"
              >
                －
              </button>
            </div>

            <div className="px-2 py-2 flex flex-col gap-0.5 overflow-y-auto">
              {FLAGS.map((f) => {
                const active = on.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggle(f.id)}
                    className="text-left px-2 py-1.5 rounded-lg text-xs cursor-pointer flex gap-2"
                    style={active ? { backgroundColor: '#D03530', color: '#fff' } : { color: '#2C2A25' }}
                  >
                    <span className="pt-px flex-shrink-0" aria-hidden="true">
                      {active ? '☑' : '☐'}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold">{f.label}</span>
                      <span
                        className="block text-[10px] leading-tight mt-0.5"
                        style={{ color: active ? 'rgba(255,255,255,0.85)' : '#6E6C64' }}
                      >
                        {f.note}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-shrink-0" style={{ borderTop: '1px solid #D8D6D0' }}>
              <button
                onClick={() => setOn([])}
                className="flex-1 px-2 py-2 text-[10px] cursor-pointer"
                style={{ color: '#6E6C64', borderRight: '1px solid #D8D6D0' }}
              >
                全部オフ
              </button>
              <button
                onClick={() => {
                  window.localStorage.removeItem(STORAGE_KEY);
                  delete document.documentElement.dataset.lab;
                  setEnabled(false);
                }}
                className="flex-1 px-2 py-2 text-[10px] cursor-pointer"
                style={{ color: '#6E6C64' }}
              >
                ラボ終了
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="rounded-full px-3 py-2 text-xs font-bold shadow-lg cursor-pointer"
            style={{ backgroundColor: '#D03530', color: '#fff' }}
          >
            lab {on.length ? `(${on.length})` : ''}
          </button>
        )}
      </div>
    </>
  );
}

// --- 挿入先を作る ------------------------------------------------
function useSlot(where: 'top' | 'bottom') {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;
    const el = document.createElement('div');
    if (where === 'top') main.insertBefore(el, main.firstChild);
    else main.appendChild(el);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHost(el);
    return () => el.remove();
  }, [where]);
  return host;
}

// カード裏と同じ体裁の枠
function StatusBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg p-4 font-mono text-xs"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      {children}
    </div>
  );
}

function Gauge({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex-1 min-w-0 truncate" style={{ color: 'var(--color-text)' }}>
        {label}
      </span>
      <span className="w-24 h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--color-border)' }}>
        <span
          className="block h-full rounded-full"
          style={{ width: `${(value / max) * 100}%`, backgroundColor: 'var(--color-accent)' }}
        />
      </span>
      <span className="w-12 text-right flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
        Lv.{value}
      </span>
    </div>
  );
}

// ============================================================
// Skills — とくぎ欄。
// 主題ごとの件数がそのまま Lv になる。「大企業の変革 Lv.10」は
// 実際に10回その話をしたという意味で、盛っていない
// ============================================================

function SkillPanel() {
  const host = useSlot('top');
  const counts = useMemo(() => {
    const all = [...speakings, ...interviews, ...writings];
    return THEMES.filter((t) => t.id !== 'misc')
      .map((t) => ({ label: t.label, n: all.filter((x) => THEME_OF[x.id] === t.id).length }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n);
  }, []);

  if (!host) return null;
  const max = counts[0]?.n ?? 1;

  return createPortal(
    <section style={{ paddingTop: 'var(--space-section)' }}>
      <h2 className="font-display text-lg font-bold tracking-widest uppercase mb-5 flex items-center gap-2.5">
        <span style={{ color: 'var(--color-accent)', fontSize: '0.8em' }}>▸</span>
        Skills
        <span className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
      </h2>
      <StatusBox>
        <div className="mb-3 pb-2" style={{ borderBottom: '1px dashed var(--color-border)' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>とくぎ</span>
          <span className="ml-2" style={{ color: 'var(--color-text-muted)' }}>
            ／ Lv は話した・書いた回数
          </span>
        </div>
        <div className="space-y-2">
          {counts.map((c) => (
            <Gauge key={c.label} label={c.label} value={c.n} max={max} />
          ))}
        </div>
      </StatusBox>
    </section>,
    host
  );
}

// ============================================================
// Party — 経歴を「なかま」欄に。在籍年数が Lv
// ============================================================

function PartyList() {
  const host = useSlot('top');
  if (!host) return null;

  const now = new Date();
  const years = (e: (typeof profile.experiences)[number]) => {
    const [sy, sm] = e.startDate.split('-').map(Number);
    const [ey, em] = (e.endDate ?? `${now.getFullYear()}-${now.getMonth() + 1}`).split('-').map(Number);
    return Math.max(1, Math.round((ey - sy) * 12 + (em - sm)) / 12);
  };

  return createPortal(
    <section style={{ paddingTop: 'var(--space-section)' }}>
      <h2 className="font-display text-lg font-bold tracking-widest uppercase mb-5 flex items-center gap-2.5">
        <span style={{ color: 'var(--color-accent)', fontSize: '0.8em' }}>▸</span>
        Party
        <span className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
      </h2>
      <StatusBox>
        <div className="mb-3 pb-2" style={{ borderBottom: '1px dashed var(--color-border)' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>なかま</span>
          <span className="ml-2" style={{ color: 'var(--color-text-muted)' }}>
            ／ Lv は在籍年数
          </span>
        </div>
        <ul className="list-none space-y-2.5">
          {profile.experiences.map((e) => (
            <li key={e.company} className="flex items-baseline gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: e.isCurrent ? 'var(--color-accent)' : 'var(--color-border)' }}
              />
              <span className="flex-1 min-w-0">
                <span className="block" style={{ color: 'var(--color-text)' }}>
                  {e.company}
                  <span className="ml-2" style={{ color: 'var(--color-text-muted)' }}>
                    {e.role}
                  </span>
                </span>
                <span className="block text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                  {e.period}
                  {e.isCurrent && ' ／ パーティにいる'}
                </span>
              </span>
              <span className="flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                Lv.{Math.round(years(e))}
              </span>
            </li>
          ))}
        </ul>
      </StatusBox>
    </section>,
    host
  );
}

// ============================================================
// Command — Contact を「▶ はなす」のコマンド窓に。
// フォームは「はなす」を選んだあとに出る
// ============================================================

const COMMANDS = [
  { key: 'talk', label: 'はなす', note: 'フォームから相談する' },
  { key: 'x', label: 'てがみをおくる', note: 'X のダイレクトメッセージ' },
  { key: 'link', label: 'なかまをさがす', note: 'LinkedIn' },
];

function CommandWindow() {
  const [chosen, setChosen] = useState<string | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const section = Array.from(document.querySelectorAll<HTMLElement>('main section')).find(
      (s) => s.querySelector('h2')?.textContent?.trim() === 'Contact'
    );
    const form = section?.querySelector('form')?.parentElement;
    if (!section || !form) return;
    const el = document.createElement('div');
    el.className = 'mb-6';
    section.insertBefore(el, form);
    document.documentElement.classList.add('lab-hide-form');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHost(el);
    return () => {
      el.remove();
      document.documentElement.classList.remove('lab-hide-form');
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('lab-show-form', chosen === 'talk');
  }, [chosen]);

  if (!host) return null;

  return createPortal(
    <StatusBox>
      <p className="mb-3" style={{ color: 'var(--color-text-muted)' }}>
        コマンド？
      </p>
      <ul className="list-none space-y-1">
        {COMMANDS.map((c) => {
          const on = chosen === c.key;
          return (
            <li key={c.key}>
              <button
                onClick={() => {
                  if (c.key === 'x') window.open(profile.socials.twitter, '_blank', 'noopener');
                  else if (c.key === 'link') window.open(profile.socials.linkedin, '_blank', 'noopener');
                  else setChosen(on ? null : 'talk');
                }}
                className="w-full text-left py-1 cursor-pointer flex items-center gap-2"
                style={{ color: on ? 'var(--color-accent)' : 'var(--color-text)' }}
              >
                <span style={{ visibility: on ? 'visible' : 'hidden' }}>▶</span>
                <span className="font-bold">{c.label}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>／ {c.note}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </StatusBox>,
    host
  );
}

// ============================================================
// Encounter — セクションに入ると「◯◯があらわれた！」
// カード裏の演出を、スクロールの節目に持ち出す
// ============================================================

function SectionEncounter() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let last = '';
    let timer: number;
    const onScroll = () => {
      let current = '';
      document.querySelectorAll<HTMLElement>('main section > h2').forEach((h) => {
        if (h.getBoundingClientRect().top < window.innerHeight * 0.4) {
          current = h.textContent?.trim() ?? '';
        }
      });
      if (current && current !== last) {
        last = current;
        setMsg(`${current} があらわれた！`);
        clearTimeout(timer);
        timer = window.setTimeout(() => setMsg(''), 1600);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, []);

  if (!msg) return null;

  return (
    <div className="lab-encounter font-mono">
      <span>{msg}</span>
    </div>
  );
}

// ============================================================
// Save — 再訪すると「おかえりなさい」。ぼうけんのしょ
// ============================================================

const VISIT_KEY = 'lab-visits';

function SaveFile() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const n = Number(window.localStorage.getItem(VISIT_KEY) ?? '0') + 1;
    window.localStorage.setItem(VISIT_KEY, String(n));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMsg(
      n === 1
        ? 'ぼうけんのしょを つくりました'
        : `おかえりなさい。${n}かいめの ぼうけんです`
    );
    const t = window.setTimeout(() => setMsg(''), 3200);
    return () => clearTimeout(t);
  }, []);

  if (!msg) return null;

  return (
    <div className="lab-save font-mono">
      <span>{msg}</span>
    </div>
  );
}

// ============================================================
// LevelUp — 読み進むと Lv が上がる。
// 経歴の年が経験値になり、下まで読むと現在の年に追いつく
// ============================================================

function LevelUp() {
  const [year, setYear] = useState(2016);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let last = 2016;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      const y = 2016 + Math.round(p * (new Date().getFullYear() - 2016));
      if (y !== last) {
        last = y;
        setYear(y);
        setFlash(true);
        window.setTimeout(() => setFlash(false), 500);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="lab-levelup font-mono"
      style={{ color: flash ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
    >
      {year}
    </div>
  );
}
