import { Mail } from 'lucide-react';
import { useScrolledPastHero } from '../hooks/useScrolledPastHero';
import profile from '../data/profile.json';

// Zone 1（カード）を通り過ぎたら現れる常駐バー。
// 名前と連絡手段だけを持たせ、肩書きは繰り返さない
// （Zone 1 で読めているし、ここは「誰か」より「連絡できる」が仕事）。
const LINKS = [
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
  {
    label: 'note',
    href: profile.socials.note,
    icon: (
      <img
        src="https://assets.st-note.com/poc-image/manual/note-common-images/production/icons/android-chrome-192x192.png"
        alt=""
        className="w-4 h-4 rounded-sm"
      />
    ),
  },
];

export default function ScrollHud() {
  const shown = useScrolledPastHero();

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[150] transition-all duration-300"
      style={{
        transform: shown ? 'translateY(0)' : 'translateY(-100%)',
        opacity: shown ? 1 : 0,
        pointerEvents: shown ? 'auto' : 'none',
        backgroundColor: 'rgba(250,249,247,0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
      }}
      aria-hidden={!shown}
    >
      <div className="max-w-[640px] mx-auto px-4 py-2 flex items-center gap-2">
        <img
          src={profile.imageUrl}
          alt=""
          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
          style={{ border: '1.5px solid var(--color-border-strong)' }}
        />
        <p className="text-sm font-bold leading-tight flex-1 min-w-0 truncate">{profile.name}</p>

        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={l.label}
            className="p-1.5 rounded-lg press-in flex-shrink-0"
          >
            {l.icon}
          </a>
        ))}

        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold press-in flex-shrink-0"
          style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
        >
          <Mail size={13} />
          Contact
        </a>
      </div>
    </div>
  );
}
