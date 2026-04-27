import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import SEO from './components/SEO';
import ParticleBackground from './components/ParticleBackground';
import {
  ExternalLink,
  Linkedin,
  Facebook,
  FileText,
  Video,
  Link as LinkIcon,
  QrCode,
  X,
  Check,
} from 'lucide-react';

import staticWritings from './data/writings.json';
import staticSpeakings from './data/speakings.json';
import staticInterviews from './data/interviews.json';

declare const __BUILD_DATE__: string;
const LAST_UPDATED = __BUILD_DATE__;

// --- Types ---
interface RelatedLink {
  label: string;
  url: string;
  type: 'slide' | 'video' | 'article' | 'event';
}

interface Speaking {
  id: string;
  date: string;
  event: string;
  title: string;
  mainLink: string;
  relatedLinks: RelatedLink[];
  imageUrl?: string;
}

interface Interview {
  id: string;
  date: string;
  media: string;
  title: string;
  link: string;
  imageUrl?: string;
}

interface Writing {
  id: string;
  title: string;
  source: string;
  date: string;
  link: string;
  imageUrl?: string;
}

interface Experience {
  company: string;
  description: string;
  role: string;
  period: string;
  isCurrent: boolean;
  website?: string;
}

// --- Hook: Section visibility ---
function useSectionInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}


// --- Data ---
const profile = {
  name: "Yuta Kanehara",
  tagline: "良い組織が、良いプロダクトをつくる",
  positions: [
    "Muture 執行役員 CPO",
    "marui unite 取締役 CPO",
  ],
  handle: "@yukagil",
  imageUrl: "https://storage.googleapis.com/studio-cms-assets/projects/Z9qp7nJGOP/s-1120x1120_v-fs_webp_2a3f9622-e54d-4f8b-8670-510ba156906d_small.webp",
  about: "プロダクトマネジメントを軸に、戦略から実装までをアラインメントすることで、チームと共に価値あるプロダクトを届けます。個の馬力ではなく、組織で課題を解決するアプローチを大切にしています。",
  socials: {
    twitter: "https://twitter.com/yukagil",
    linkedin: "https://www.linkedin.com/in/yuta-kanehara/",
    facebook: "https://www.facebook.com/yuta.kanehara",
    youtrust: "https://youtrust.jp/users/yukagil",
  },
};

const experiences: Experience[] = [
  { company: "Muture", description: "プロダクト開発と組織変革を両立し、持続可能な変革を支援するDXパートナー", role: "執行役員 CPO", period: "2023 - now", isCurrent: true, website: "https://muture.jp/" },
  { company: "marui unite", description: "丸井グループのデジタルプロダクト開発を行うテックカンパニー", role: "取締役 CPO", period: "2024 - now", isCurrent: true, website: "https://marui-unite.co.jp/" },
  { company: "Showcase Gig", description: "モバイルオーダープラットフォーム「O:der」を提供。次世代店舗体験を創出", role: "VP of Product", period: "2020 - 2023", isCurrent: false, website: "https://www.showcase-gig.com/" },
  { company: "DeNA", description: "ゲーム、スポーツ、ヘルスケアなど多角的に事業を展開するIT企業", role: "Engineer → PM", period: "2016 - 2020", isCurrent: false, website: "https://dena.com/" },
];

interface ServiceItem {
  name: string;
  detail: string;
  links?: { label: string; href: string }[];
  formNote?: boolean;
}

const services: ServiceItem[] = [
  {
    name: '外部顧問・アドバイザリー',
    detail: '組織変革・リーダー育成・チームトレーニング等の伴走支援',
    links: [
      { label: 'Muture', href: 'https://muture.jp/' },
      { label: 'Product People', href: 'https://productpeople.jp/' },
    ],
  },
  {
    name: 'プロダクトコーチング(単発)',
    detail: '目安: 5,000円程度 / 1時間オンラインMTG',
    links: [
      { label: 'Granty PM', href: 'https://pm-notes.com/pm_37/' },
    ],
  },
  {
    name: 'プロダクトコーチング(定期)',
    detail: '目安: パーソナルトレーニング程度 / 月2〜4回のMTG＋非同期サポート',
    formNote: true,
  },
];

function calculateAge() {
  const birth = new Date(1993, 9, 12); // 1993/10/12 (month is 0-indexed)
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const interviews = staticInterviews as Interview[];
const speakings = (staticSpeakings as Speaking[]).slice(0, 5);
const writings = staticWritings as Writing[];

// ============================================================
// Main Component
// ============================================================
export default function Home() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [encounterActive, setEncounterActive] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const zone1Ref = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  // Show header when scrolled past Zone 1
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowHeader(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (zone1Ref.current) observer.observe(zone1Ref.current);
    return () => observer.disconnect();
  }, []);

  // DQ encounter transition (flash on enter, simple fade on return)
  const handleCardFlip = useCallback(() => {
    if (encounterActive) return;
    const entering = !isFlipped;
    setEncounterActive(true);

    if (entering) {
      // DQ flash on encounter
      if (flashRef.current) {
        flashRef.current.classList.remove('dq-encounter-flash');
        void flashRef.current.offsetWidth;
        flashRef.current.classList.add('dq-encounter-flash');
      }
      setTimeout(() => setIsFlipped(true), 350);
      setTimeout(() => setEncounterActive(false), 1000);
    } else {
      // Simple fade back
      setIsFlipped(false);
      setTimeout(() => setEncounterActive(false), 300);
    }
  }, [encounterActive, isFlipped]);

  const displayedWritings = writings.slice(0, 5);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <SEO />

      {/* Floating Header — appears on scroll past Zone 1 */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{
          backgroundColor: 'rgba(250, 249, 247, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid var(--color-border)`,
        }}
      >
        <div className="max-w-[640px] mx-auto px-4 flex items-center justify-between h-12">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display font-bold text-sm"
            style={{ color: 'var(--color-text)' }}
          >
            Yuta Kanehara
          </button>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all press-in"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: '#fff',
            }}
          >
            Contact
          </a>
        </div>
      </header>

      {/* ============================================================ */}
      {/* ZONE 1: The Card */}
      {/* ============================================================ */}
      <div
        ref={zone1Ref}
        className="flex flex-col items-center justify-center px-4 relative overflow-hidden"
        style={{ minHeight: '100dvh' }}
      >
        {/* Physics particle background */}
        <ParticleBackground />

        {/* DQ-style encounter flash overlay */}
        <div
          ref={flashRef}
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ backgroundColor: '#000', opacity: 0 }}
        />

        {/* Subtle spotlight behind card */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(240,239,237,0.6) 0%, transparent 60%)' }}
        />

        {/* Card content — swaps between front/back */}
        <div className="w-full max-w-[320px] relative z-10" onDoubleClick={handleCardFlip}>
          {!isFlipped ? (
            /* Front — Normal profile card */
            <div className="flex flex-col items-center text-center">
              <div className="animate-enter profile-frame mb-5">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden"
                  style={{ border: '2px solid var(--color-border-strong)' }}
                >
                  <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
                </div>
              </div>

              <h1 className="animate-enter animate-enter-delay-1 font-display text-2xl font-bold tracking-tight mb-2">
                {profile.name}
              </h1>

              <p className="animate-enter animate-enter-delay-2 text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                {profile.tagline}
              </p>

              <div className="animate-enter animate-enter-delay-3 flex flex-col gap-0.5 mb-5">
                {profile.positions.map((pos, i) => (
                  <span key={i} className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>{pos}</span>
                ))}
              </div>

              <div className="animate-enter animate-enter-delay-4 flex items-center gap-3 mb-4">
                <SocialIcon
                  href={profile.socials.twitter}
                  label="X"
                  icon={<img src="https://abs.twimg.com/responsive-web/client-web/icon-svg.ea5ff4aa.svg" alt="" className="w-[18px] h-[18px]" />}
                />
                <SocialIcon href={profile.socials.linkedin} label="LinkedIn" icon={<Linkedin size={18} />} />
                <SocialIcon href={profile.socials.facebook} label="Facebook" icon={<Facebook size={18} />} />
                <SocialIcon
                  href={profile.socials.youtrust}
                  label="YOUTRUST"
                  icon={<img src="https://daxgddo8oz9ps.cloudfront.net/assets/common/favicon-f68a538cb715f05c5bcda84989832063f19220d53cf957de83385ca7ba3d9abc.png" alt="" className="w-[18px] h-[18px] grayscale" />}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setShowQr(true); }}
                  className="p-2.5 rounded-xl transition-all press-in cursor-pointer"
                  style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                  aria-label="QR Code"
                >
                  <QrCode size={18} />
                </button>
              </div>

              <p className="animate-enter animate-enter-delay-5 font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {profile.handle}
              </p>
            </div>
          ) : (
            /* Back — DQ encounter: RPG status screen */
            <div
              className="dq-encounter-content cursor-pointer w-full"
              onClick={(e) => { e.stopPropagation(); handleCardFlip(); }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ border: '2px solid var(--color-border-strong)' }}
                >
                  <img
                    src="/pixel-avatar.png"
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' } as React.CSSProperties}
                  />
                </div>
                <div className="text-left">
                  <p className="font-mono text-xs mb-0.5" style={{ color: 'var(--color-accent)' }}>
                    Yuta があらわれた！
                  </p>
                  <p className="font-display text-lg font-bold leading-tight">Yuta Kanehara</p>
                  <p className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Lv.{calculateAge()} ｜ AB型
                  </p>
                </div>
              </div>

              {/* RPG Status Box */}
              <div
                className="rounded-lg p-4 mb-4 font-mono text-xs"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {/* Class = MBTI */}
                <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px dashed var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>CLASS</span>
                  <span className="font-bold" style={{ color: 'var(--color-accent)' }}>巨匠（ISTP）</span>
                </div>

                {/* Hobby stats — gauges */}
                <div className="space-y-2 mb-3 pb-3" style={{ borderBottom: '1px dashed var(--color-border)' }}>
                  <RpgGauge label="Camp" value={92} color="#4A7C59" />
                  <RpgGauge label="Snowboard" value={80} color="#3B82C4" />
                  <RpgGauge label="Scuba" value={55} color="#2B6EA0" />
                  <RpgGauge label="Coffee" value={95} color="#8B6914" />
                </div>

                {/* StrengthsFinder Top 10 — numbered, ordered */}
                <div className="mb-1">
                  <span style={{ color: 'var(--color-text-muted)' }}>STRENGTHS</span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1.5">
                  {[
                    '自己確信', '親密性', '慎重さ', '調和性', '最上志向',
                    '着想', '適応性', '分析思考', '責任感', 'アレンジ',
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span
                        className="w-4 text-right flex-shrink-0"
                        style={{ color: i < 5 ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                      >
                        {i + 1}.
                      </span>
                      <span style={{ color: i < 5 ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>


              <p className="text-center font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                ▼ tap to return
              </p>
            </div>
          )}
        </div>

        {/* Flip hint */}
        {!isFlipped && (
          <div className="absolute bottom-16 z-10 flip-hint">
            <span className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
              double tap to flip
            </span>
          </div>
        )}

        {/* Living Edge — breathing dots */}
        <div className="absolute bottom-8 flex gap-2">
          <div className="breathing-dot w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-text-muted)' }} />
          <div className="breathing-dot w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-text-muted)' }} />
          <div className="breathing-dot w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-text-muted)' }} />
        </div>
      </div>

      {/* ============================================================ */}
      {/* ZONE 2: The Depth */}
      {/* ============================================================ */}
      <main className="max-w-[640px] mx-auto px-4 pb-16">

        {/* Experience */}
        <Section title="Experience">
          <div className="flex flex-col gap-4">
            {experiences.map((exp, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center pt-1.5">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: exp.isCurrent ? 'var(--color-accent)' : 'var(--color-border)',
                    }}
                  />
                  {i < experiences.length - 1 && (
                    <div className="w-px flex-1 mt-1" style={{ backgroundColor: 'var(--color-border)' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-baseline justify-between gap-2">
                    {exp.website ? (
                      <a
                        href={exp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold transition-colors link-accent"
                      >
                        {exp.company}<ExternalLink size={10} className="inline ml-1 opacity-40" />
                      </a>
                    ) : (
                      <span className="text-sm font-bold">{exp.company}</span>
                    )}
                    <span className="font-mono text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {exp.role}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Interviews */}
        <Section title="Interviews">
          <div className="flex flex-col gap-0">
            {interviews.map((item) => (
              <InterviewRow key={item.id} item={item} />
            ))}
          </div>
        </Section>

        {/* Speaking */}
        <Section title="Speaking">
          <div className="flex flex-col gap-0">
            {speakings.map((item) => (
              <SpeakingRow key={item.id} item={item} />
            ))}
          </div>
        </Section>

        {/* Writings */}
        <Section title="Writings">
          <div className="flex flex-col gap-0">
            {displayedWritings.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-3 px-2 -mx-2 rounded-lg transition-colors game-select"
                style={{ color: 'var(--color-text)' }}
              >
                <span className="text-sm font-medium line-clamp-2 flex-1 mr-3">{item.title}</span>
                <span className="font-mono text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                  {item.date}
                </span>
              </a>
            ))}
          </div>
          <a
            href="https://note.com/yukagil"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold py-2 transition-colors link-accent"
            style={{ color: 'var(--color-text-muted)' }}
          >
            もっと見る（note）
            <ExternalLink size={10} />
          </a>
        </Section>

        {/* Services */}
        <Section title="Services" id="services">
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-text-secondary)' }}>
            これまでの経験をもとに、プロダクトマネジメントや組織づくりの支援もしています。
          </p>
          <div>
            {services.map((s, i) => (
              <div
                key={i}
                className="py-4"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                <p className="text-sm font-medium mb-1">{s.name}</p>
                <p className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {s.detail}
                </p>
                {s.links && (
                  <div className="flex flex-wrap gap-3">
                    {s.links.map((l, j) => (
                      <a
                        key={j}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold link-accent"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {l.label}
                        <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                )}
                {s.formNote && (
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Contact →
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Contact */}
        <Section title="Contact" id="contact">
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            依頼するか決まっていなくても、何を相談したいか言語化できていなくても、ぜんぜん大丈夫！「こんなことで困ってるんですが」くらいの気持ちで、気軽に声をかけてください。
          </p>

          <ul className="space-y-2 mb-8">
            {[
              '相談だけでも大歓迎',
              'オンラインMTGでお気軽にどうぞ',
              '3営業日以内にお返事します',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <Check size={16} strokeWidth={2.5} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <ContactForm />
        </Section>

        {/* Footer */}
        <footer
          className="mt-16 pt-8 pb-4 text-center border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
            &copy; {new Date().getFullYear()} Yuta Kanehara
          </p>
          <p className="font-mono text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Last updated: {LAST_UPDATED}
          </p>
        </footer>
      </main>

      {/* QR Code Modal */}
      {showQr && <QrModal profile={profile} onClose={() => setShowQr(false)} />}
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function QrModal({ profile, onClose }: {
  profile: { name: string; imageUrl: string; positions: string[] };
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, 'https://yukagil.github.io', {
        width: 160,
        margin: 2,
        color: { dark: '#2C2A25', light: '#FFFFFF' },
      });
    }
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[320px] rounded-2xl shadow-xl overflow-hidden animate-enter"
        style={{ backgroundColor: '#fff' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent red line at top */}
        <div className="h-1" style={{ backgroundColor: 'var(--color-accent)' }} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg transition-colors cursor-pointer"
          style={{ color: 'var(--color-text-muted)' }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Profile info */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4">
          <div
            className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
            style={{ border: '2px solid var(--color-border)' }}
          >
            <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-display text-base font-bold">{profile.name}</p>
            {profile.positions.map((pos, i) => (
              <p key={i} className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>{pos}</p>
            ))}
          </div>
        </div>

        {/* QR code */}
        <div className="flex justify-center px-6 py-4">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>

        {/* URL footer */}
        <div
          className="px-6 py-3 text-center"
          style={{ backgroundColor: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}
        >
          <p className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
            yukagil.github.io
          </p>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2.5 rounded-xl transition-all press-in"
      style={{
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text)',
      }}
      aria-label={label}
    >
      {icon}
    </a>
  );
}

function Section({ id, title, children }: { id?: string; title?: string; children: React.ReactNode }) {
  const { ref, isInView } = useSectionInView();

  return (
    <section
      ref={ref}
      id={id}
      className={`animate-section ${isInView ? 'in-view' : ''}`}
      style={{ paddingTop: 'var(--space-section)', scrollMarginTop: '64px' }}
    >
      {title && (
        <h2
          className="font-display text-sm font-bold tracking-widest uppercase mb-4 border-l-2 pl-3"
          style={{ color: 'var(--color-text-secondary)', borderColor: 'var(--color-accent)' }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function InterviewRow({ item }: { item: Interview }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between py-3 px-2 -mx-2 rounded-lg transition-colors game-select"
    >
      <div className="flex-1 min-w-0 mr-3">
        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.media}</div>
        <div className="text-sm font-medium line-clamp-2">{item.title}</div>
      </div>
      <span className="font-mono text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
        {item.date}
      </span>
    </a>
  );
}

function SpeakingRow({ item }: { item: Speaking }) {
  return (
    <div
      className="group py-3 px-2 -mx-2 rounded-lg transition-colors game-select"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 mr-3">
          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.event}</div>
          {item.mainLink && item.mainLink !== '#' ? (
            <a
              href={item.mainLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium line-clamp-2 transition-colors link-accent"
            >
              {item.title}
            </a>
          ) : (
            <span className="text-sm font-medium line-clamp-2">{item.title}</span>
          )}
        </div>
        <span className="font-mono text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
          {item.date}
        </span>
      </div>
      {item.relatedLinks && item.relatedLinks.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {item.relatedLinks.map((link, idx) => {
            const Icon = link.type === 'slide' ? FileText : link.type === 'video' ? Video : LinkIcon;
            return (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded transition-colors link-accent"
                style={{
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <Icon size={10} />
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}


function RpgGauge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-right flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-6 text-right flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
        {value}
      </span>
    </div>
  );
}

function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inputStyle = {
    backgroundColor: '#fff',
    border: '1px solid var(--color-border-strong)',
    color: 'var(--color-text)',
  };

  if (isSubmitted) {
    return (
      <div
        className="p-6 rounded-xl text-center"
        style={{
          backgroundColor: '#fff',
          border: '1px solid var(--color-border-strong)',
        }}
      >
        <p className="font-display text-base font-bold mb-2" style={{ color: 'var(--color-accent)' }}>
          ありがとうございます！
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          内容を確認のうえ、3営業日以内にお返事します。
        </p>
        <p className="text-xs mt-3" style={{ color: 'var(--color-text-muted)' }}>
          ご相談の内容によっては、お返事ができない場合もあります。あらかじめご了承ください。
        </p>
      </div>
    );
  }

  return (
    <>
      <form
        action="https://docs.google.com/forms/u/1/d/e/1FAIpQLSfxLyM87rwRAxV7kbWvvBVMASeX_CjOsHOuM-Z4liQxANZ-zg/formResponse"
        method="POST"
        target="hidden_iframe"
        onSubmit={() => {
          const iframe = document.getElementById('hidden_iframe') as HTMLIFrameElement;
          if (iframe) {
            iframe.onload = () => {
              setIsSubmitted(true);
              const form = document.querySelector('form[target="hidden_iframe"]') as HTMLFormElement;
              if (form) form.reset();
            };
          }
        }}
        className="space-y-5"
      >
        <div>
          <label htmlFor="field-name" className="block text-sm font-bold mb-1.5">
            お名前 <span className="text-xs" style={{ color: 'var(--color-accent)' }}>*</span>
          </label>
          <input
            type="text"
            id="field-name"
            name="entry.356289134"
            required
            className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{ ...inputStyle, '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties}
            placeholder="例: 山田 太郎"
          />
        </div>

        <div>
          <label htmlFor="field-company" className="block text-sm font-bold mb-1.5">
            会社名
            <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>
              （個人のご相談なら空欄で大丈夫です）
            </span>
          </label>
          <input
            type="text"
            id="field-company"
            name="entry.1060507538"
            className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{ ...inputStyle, '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties}
            placeholder="例: 株式会社○○"
          />
        </div>

        <div>
          <label htmlFor="field-contact" className="block text-sm font-bold mb-1.5">
            ご連絡先 <span className="text-xs" style={{ color: 'var(--color-accent)' }}>*</span>
            <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>
              （メール・SNS の URL など、お返事できる先）
            </span>
          </label>
          <input
            type="text"
            id="field-contact"
            name="entry.1020997844"
            required
            className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2"
            style={{ ...inputStyle, '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties}
            placeholder="例: name@example.com"
          />
        </div>

        <div>
          <label htmlFor="field-message" className="block text-sm font-bold mb-1.5">
            ご相談内容 <span className="text-xs" style={{ color: 'var(--color-accent)' }}>*</span>
          </label>
          <textarea
            id="field-message"
            name="entry.243889220"
            required
            rows={6}
            className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none"
            style={{ ...inputStyle, '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties}
            placeholder="どんなことに困っているか、現状や背景など、思っていることをそのまま書いていただいてOKです。"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all press-in"
            style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
          >
            送信
          </button>
        </div>
      </form>
      <iframe
        id="hidden_iframe"
        name="hidden_iframe"
        title="Form submission target"
        style={{ display: 'none' }}
      />
    </>
  );
}
