import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import SEO from './components/SEO';
import ParticleBackground from './components/ParticleBackground';
import ScrollHud from './components/ScrollHud';
import SectionRail from './components/SectionRail';
import SectionMenu from './components/SectionMenu';
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
  ChevronDown,
  MessageCircle,
  Copy,
} from 'lucide-react';

import staticSpeakings from './data/speakings.json';
import staticInterviews from './data/interviews.json';
import staticProfile from './data/profile.json';
import qabox from './data/qabox.json';

declare const __BUILD_DATE__: string;
declare const __BUILD_YEAR__: number;
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
  summary?: string;
  mainLink: string;
  relatedLinks: RelatedLink[];
  imageUrl?: string;
}

interface Interview {
  id: string;
  date: string;
  media: string;
  title: string;
  summary?: string;
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


interface ServiceItem {
  name: string;
  detail: string;
  links?: { label: string; href: string }[];
}

// --- Data ---
// 表示・構造化データ(SEO.tsx)・llms.txt 生成(scripts/gen-agent-assets.js) が
// 同じ src/data/profile.json を参照する
const profile = staticProfile;
const experiences = staticProfile.experiences as Experience[];
const services = staticProfile.services as ServiceItem[];

// "2026.04.12" -> "2026-04-12"（<time datetime> 用）
function toIsoDate(date: string): string | undefined {
  const m = date?.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/);
  return m ? `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}` : undefined;
}

function DateText({ date, className }: { date: string; className?: string }) {
  const iso = toIsoDate(date);
  return (
    <time dateTime={iso} className={className} style={{ color: 'var(--color-text-muted)' }}>
      {date}
    </time>
  );
}

function calculateAge() {
  const birth = new Date(1993, 9, 12); // 1993/10/12 (month is 0-indexed)
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const interviews = staticInterviews as Interview[];
const speakings = staticSpeakings as Speaking[];

// 登壇は10件・4年ぶんあるので年で絞れるようにする。
// Interviews は3件しかなく、チップのほうが中身より多くなるので付けない
const speakingYears = [...new Set(speakings.map((s) => s.date.slice(0, 4)))].sort().reverse();

// ============================================================
// Main Component
// ============================================================
export default function Home() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [encounterActive, setEncounterActive] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showAllInterviews, setShowAllInterviews] = useState(false);
  const [showAllSpeakings, setShowAllSpeakings] = useState(false);
  const [speakingYear, setSpeakingYear] = useState('all');
  const flashRef = useRef<HTMLDivElement>(null);

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

  return (
    <div style={{ color: 'var(--color-text)' }}>
      <SEO />
      <ScrollHud />
      <SectionRail />
      <SectionMenu />

      {/* ============================================================ */}
      {/* ZONE 1: The Card */}
      {/* ============================================================ */}
      <div
        className="flex flex-col items-center justify-center px-4 relative overflow-hidden"
        style={{ minHeight: 'calc(100dvh - var(--frame) * 2)' }}
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
          <ol className="flex flex-col gap-4 list-none">
            {experiences.map((exp, i) => (
              <li key={i} className="flex gap-3">
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
              </li>
            ))}
          </ol>

          <ProfileBios />
        </Section>

        {/* Interviews — first one gets a photo (personality shows through), rest are text rows */}
        {/* 全件を DOM に出し、4件目以降は CSS で隠す。クローラ／エージェントには全件届く */}
        <Section title="Interviews">
          <ul className="flex flex-col gap-2 list-none">
            {interviews.map((item, i) => (
              <li key={item.id} hidden={i >= 3 && !showAllInterviews}>
                {i === 0 ? (
                  <FeaturedCard
                    link={item.link}
                    imageUrl={item.imageUrl}
                    label={item.media}
                    title={item.title}
                    date={item.date}
                    summary={item.summary}
                  />
                ) : (
                  <InterviewRow item={item} />
                )}
              </li>
            ))}
          </ul>
          {interviews.length > 3 && (
            <MoreButton
              expanded={showAllInterviews}
              onClick={() => setShowAllInterviews((v) => !v)}
            />
          )}
        </Section>

        {/* Speaking */}
        <Section title="Speaking">
          <YearChips years={speakingYears} value={speakingYear} onChange={setSpeakingYear} />
          <ul className="flex flex-col gap-0 list-none">
            {speakings.map((item, i) => (
              <li
                key={item.id}
                hidden={
                  speakingYear === 'all'
                    ? i >= 3 && !showAllSpeakings
                    : !item.date.startsWith(speakingYear)
                }
              >
                <SpeakingRow item={item} />
              </li>
            ))}
          </ul>
          {speakingYear === 'all' && speakings.length > 3 && (
            <MoreButton
              expanded={showAllSpeakings}
              onClick={() => setShowAllSpeakings((v) => !v)}
            />
          )}
        </Section>

        {/* Writings — link blocks to the platforms where I write */}
        <Section title="Writings">
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            プロダクトマネジメントや組織の話を中心に、考えたことを書いています。じっくりまとめた記事は note、その手前の短い思考は X（記事）に。
          </p>
          <div className="grid grid-cols-2 gap-3">
            <WriteBlock
              href="https://note.com/yukagil"
              label="note"
              icon={<img src="https://assets.st-note.com/poc-image/manual/note-common-images/production/icons/android-chrome-192x192.png" alt="note" className="w-6 h-6 rounded" />}
            />
            <WriteBlock
              href="https://x.com/yukagil/articles"
              label="記事"
              labelClassName="text-xs"
              icon={<img src="https://abs.twimg.com/responsive-web/client-web/icon-svg.ea5ff4aa.svg" alt="X" className="w-6 h-6" />}
            />
          </div>

          {/* 質問箱 — 記事やプロダクトマネジメントへの質問はこちら */}
          <div className="mt-5">
            <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
              ちょっとした疑問でも大歓迎です。気軽に投げてください！
            </p>
            <QaBoxCard />
          </div>
        </Section>

        {/* Services */}
        <Section title="Services" id="services">
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-text-secondary)' }}>
            これまでの経験をもとに、プロダクトマネジメントや組織づくりの支援もしています。
          </p>
          {/* 3項目を1枚の面にまとめ、境界は破線で示す。
              サイズではなく余白と面で階層をつくる */}
          <ul className="list-none">
            {services.map((s, i) => (
              <li
                key={i}
                className={i > 0 ? 'pt-4 mt-4' : undefined}
                style={i > 0 ? { borderTop: '1px solid var(--color-border)' } : undefined}
              >
                <p className="text-sm font-bold mb-1">{s.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {s.detail}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {s.links?.map((l, j) => (
                    <a
                      key={j}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold link-accent"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {l.label}
                      <ExternalLink size={10} className="opacity-60" />
                    </a>
                  ))}
                  {/* 外部の受け皿がない項目だけ、問い合わせへ送る */}
                  {!s.links && (
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold link-accent"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      相談する
                      <span aria-hidden="true" className="opacity-60">→</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
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

          {/* フォーム以外の導線も明示しておく（エージェントが連絡手段を提示できるように） */}
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
            <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
              フォーム以外でも、SNS のダイレクトメッセージから連絡いただけます。
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 list-none">
              {profile.contact.preferredChannels
                .filter((c) => !c.url.startsWith(profile.url))
                .map((c) => (
                  <li key={c.url}>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="inline-flex items-center gap-1 text-xs font-bold link-accent"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {c.label}
                      <ExternalLink size={10} className="opacity-60" />
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </Section>

        {/* Footer */}
        <footer
          className="mt-16 pt-8 pb-4 text-center border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
            &copy; {__BUILD_YEAR__} {profile.name}
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
        width: 176,
        margin: 1,
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
        <div className="flex justify-center px-6 pt-1 pb-7">
          <div
            className="p-3 rounded-xl"
            style={{ border: '1px solid var(--color-border)' }}
          >
            <canvas ref={canvasRef} className="block" />
          </div>
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
      style={{ paddingTop: 'var(--space-section)' }}
    >
      {title && (
        <h2
          className="font-display text-lg font-bold tracking-widest uppercase mb-5 border-l-2 pl-3"
          style={{ color: 'var(--color-text)', borderColor: 'var(--color-accent)' }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

// 登壇・寄稿の主催者に渡すためのプロフィール文（3パターン）。
// デフォルトは閉じた状態。中身は常に DOM にあるのでエージェントからは全量読める
function ProfileBios() {
  const [open, setOpen] = useState(false);
  // 300字版をデフォルト表示にする
  const [selected, setSelected] = useState(profile.bios.length - 1);

  return (
    <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--color-border)' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="profile-bios"
        className="inline-flex items-center gap-1.5 text-xs font-bold py-1 transition-colors link-accent cursor-pointer"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <ChevronDown
          size={12}
          className="transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(-90deg)' }}
        />
        プロフィール文（登壇・寄稿用）
      </button>

      <div id="profile-bios" hidden={!open} className="mt-3">
        <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
          ご紹介の際は、文字数に合わせてこちらをお使いください。
        </p>

        {/* 文字数セレクタ */}
        <div
          className="inline-flex gap-1 p-1 rounded-xl"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          {profile.bios.map((bio, i) => {
            const isSelected = i === selected;
            return (
              <button
                key={bio.label}
                onClick={() => setSelected(i)}
                aria-pressed={isSelected}
                className="px-3 py-1.5 rounded-lg font-mono text-xs transition-all press-in cursor-pointer"
                style={
                  isSelected
                    ? {
                        backgroundColor: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        fontWeight: 700,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                      }
                    : { color: 'var(--color-text-muted)' }
                }
              >
                {parseInt(bio.label, 10)}字
              </button>
            );
          })}
        </div>

        {/* 3本とも DOM に残し、非選択は hidden で隠す（エージェントには全量届く） */}
        <div className="mt-3">
          {profile.bios.map((bio, i) => (
            <div key={bio.label} hidden={i !== selected}>
              <BioCard text={bio.text} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BioCard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard API が使えない環境（非セキュアコンテキスト等）へのフォールバック
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(ta);
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-xl px-4 py-3.5"
      style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {text.length}字
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg transition-all press-in cursor-pointer"
          style={{
            backgroundColor: 'var(--color-bg)',
            color: copied ? 'var(--color-accent)' : 'var(--color-text-muted)',
          }}
          aria-label={`${text.length}字のプロフィール文をコピー`}
        >
          {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-xs" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        {text}
      </p>
    </div>
  );
}

// 年で絞るチップ。全件は常に DOM にあり、hidden で出し入れするだけなので
// エージェントからは絞り込み状態に関係なく全件読める
function YearChips({ years, value, onChange }: {
  years: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const options = ['all', ...years];
  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {options.map((y) => {
        const on = y === value;
        return (
          <button
            key={y}
            onClick={() => onChange(y)}
            aria-pressed={on}
            className="font-mono text-xs px-2.5 py-1 rounded-full transition-colors press-in cursor-pointer"
            style={
              on
                ? { backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', fontWeight: 700 }
                : { color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }
            }
          >
            {y === 'all' ? 'すべて' : y}
          </button>
        );
      })}
    </div>
  );
}

function MoreButton({ expanded, onClick }: {
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-1 text-xs font-bold py-2 transition-colors link-accent cursor-pointer"
      style={{ color: 'var(--color-text-muted)' }}
    >
      {expanded ? '閉じる' : 'もっと見る'}
      <ChevronDown
        size={12}
        className="transition-transform"
        style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
      />
    </button>
  );
}

function FeaturedCard({ link, imageUrl, label, title, date, summary }: {
  link: string;
  imageUrl?: string;
  label: string;
  title: string;
  date: string;
  summary?: string;
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl overflow-hidden transition-shadow hover:shadow-md"
      style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
    >
      {imageUrl && (
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div
        className="px-4 py-3"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center justify-between gap-3 mb-1">
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
          <DateText date={date} className="font-mono text-xs flex-shrink-0" />
        </div>
        <div className="text-sm font-medium leading-snug transition-colors link-accent">{title}</div>
        {summary && (
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {summary}
          </p>
        )}
      </div>
    </a>
  );
}

function InterviewRow({ item }: { item: Interview }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block py-3 px-2 -mx-2 rounded-lg transition-colors game-select"
    >
      {/* メタ行（媒体・日付）。タイトルとサマリは全幅を使えるようにする */}
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{item.media}</span>
        <DateText date={item.date} className="font-mono text-xs flex-shrink-0" />
      </div>
      <div className="text-sm font-medium line-clamp-2">{item.title}</div>
      {item.summary && (
        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
          {item.summary}
        </p>
      )}
    </a>
  );
}

function WriteBlock({ href, label, icon, labelClassName = 'text-sm' }: {
  href: string;
  label: string;
  icon: React.ReactNode;
  labelClassName?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-2 rounded-xl px-4 py-3.5 transition-shadow hover:shadow-md"
      style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
    >
      <span className="flex items-center gap-2 min-w-0">
        {icon}
        <span className={`${labelClassName} font-bold truncate`}>{label}</span>
      </span>
      <ExternalLink
        size={12}
        className="flex-shrink-0 transition-opacity opacity-40 group-hover:opacity-100"
        style={{ color: 'var(--color-accent)' }}
      />
    </a>
  );
}

function QaBoxCard() {
  return (
    <a
      href={qabox.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="note 質問箱"
      className="group flex items-center justify-between gap-2 rounded-xl px-4 py-3.5 transition-shadow hover:shadow-md"
      style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
    >
      <span className="flex items-center gap-2 min-w-0">
        <MessageCircle size={18} className="flex-shrink-0" style={{ color: 'var(--color-text-muted)' }} />
        <span className="text-sm font-bold truncate">note質問箱</span>
      </span>
      <span className="inline-flex items-center gap-1 text-xs font-bold flex-shrink-0" style={{ color: 'var(--color-accent)' }}>
        質問する
        <ExternalLink size={12} />
      </span>
    </a>
  );
}

function SpeakingRow({ item }: { item: Speaking }) {
  return (
    <div
      className="group py-3 px-2 -mx-2 rounded-lg transition-colors game-select"
    >
      {/* メタ行（イベント・日付）。タイトルとサマリは全幅を使えるようにする */}
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{item.event}</span>
        <DateText date={item.date} className="font-mono text-xs flex-shrink-0" />
      </div>
      {item.mainLink && item.mainLink !== '#' ? (
        <a
          href={item.mainLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm font-medium line-clamp-2 transition-colors link-accent"
        >
          {item.title}
        </a>
      ) : (
        <span className="block text-sm font-medium line-clamp-2">{item.title}</span>
      )}
      {item.summary && (
        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
          {item.summary}
        </p>
      )}
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
            className="w-full px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2"
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
            className="w-full px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2"
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
            className="w-full px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2"
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
            className="w-full px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 resize-none"
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
