import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from './components/SEO';
import { ExternalLink, ArrowLeft, ArrowRight, Mail } from 'lucide-react';

export default function Services() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <SEO
        title="Services | Yuta Kanehara"
        description="プロダクトマネジメント、組織デザインの観点から、企業向けアドバイザリーから個人向けコーチングまで提供しています。"
        path="/services"
      />

      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: 'rgba(250, 249, 247, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-[640px] mx-auto px-4 flex items-center h-12">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-bold transition-colors"
            style={{ color: 'var(--color-text)' }}
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>
      </header>

      <main className="max-w-[640px] mx-auto px-4 pt-10 pb-16">
        {/* Hero */}
        <div className="mb-12 animate-enter">
          <h1 className="font-display text-2xl font-bold mb-3">Services</h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            プロダクトマネジメントを軸に、戦略から実装までをアラインメントすることで、チームと共に価値あるプロダクトを届けます。個の力ではなく、組織で課題を解決するアプローチを大切にしています。
          </p>
        </div>

        {/* ============================================================ */}
        {/* 企業向けサービス */}
        {/* ============================================================ */}
        <section className="mb-16 animate-enter animate-enter-delay-1" id="corporate-coaching">
          <h2
            className="font-display text-xs font-bold tracking-widest uppercase mb-6"
            style={{ color: 'var(--color-text-muted)' }}
          >
            企業向けサービス
          </h2>

          <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>
            組織変革、リーダー育成、チームのディスカバリー力向上まで。課題に合わせた支援を提供します。
          </p>

          {(() => {
            const providers = [
              { name: 'Muture', desc: 'アドバイザリー、外部顧問、伴走支援', link: 'https://muture.jp/' },
              { name: 'Product People', desc: 'PM組織の立ち上げ、次世代リーダー育成', link: 'https://productpeople.jp/' },
            ];
            return (
              <div className="flex flex-col gap-0 mb-8">
                <ServiceRow
                  title="会社・組織を変えたい"
                  subtitle="Transformation"
                  items={['プロジェクト→プロダクト文化への移行', '組織の立ち上げ支援', 'プロセス変革']}
                  providers={providers}
                />
                <ServiceRow
                  title="プロダクトリーダーを育てたい"
                  subtitle="Product Leadership"
                  items={['ビジョン/戦略/ロードマップ策定', '組織デザイン/チームトレーニング', 'リーダーシップ開発']}
                  providers={providers}
                />
                <ServiceRow
                  title="強いプロダクトチームを作りたい"
                  subtitle="Discovery / Delivery"
                  items={['ディスカバリー/デリバリートレーニング', 'チームの自律性と成長支援', 'ステークホルダー連携']}
                  providers={providers}
                />
              </div>
            );
          })()}
        </section>

        {/* ============================================================ */}
        {/* 個人向けサービス — Pokemon move select style */}
        {/* ============================================================ */}
        <section className="mb-16 animate-enter animate-enter-delay-2" id="individual-coaching">
          <h2
            className="font-display text-xs font-bold tracking-widest uppercase mb-6"
            style={{ color: 'var(--color-text-muted)' }}
          >
            個人向けサービス
          </h2>

          <p className="text-sm mb-5" style={{ color: 'var(--color-text-secondary)' }}>
            キャリア相談やプロダクトマネジメントの実務相談など、お気軽にどうぞ。
          </p>

          <div className="flex flex-col gap-0">
            <ServiceRow
              title="匿名で相談したいとき"
              subtitle="マシュマロ"
              items={['匿名で気軽に質問・相談ができます', '無償']}
              href="https://marshmallow-qa.com/uos17sgwv5gcfe4?t=TsB6aG&utm_medium=url_text&utm_source=promotion"
              linkLabel="マシュマロを開く"
            />
            <ServiceRow
              title="単発でじっくり相談したいとき"
              subtitle="Granty PM"
              items={['1時間のオンラインMTGで相談', '※ 目安：5,000円程度 / 1時間']}
              href="https://pm-notes.com/pm_37/"
              linkLabel="Granty PMを開く"
            />
            <ServiceRow
              title="継続的なサポートが欲しいとき"
              subtitle="定期コーチング"
              items={['月2~4回のMTG＋非同期サポート', '※ 目安：パーソナルジム程度']}
              to="/contact"
            />
          </div>
        </section>

        {/* Contact — 気軽に相談 */}
        <section
          className="mb-16 animate-enter animate-enter-delay-3 p-5 rounded-lg text-center"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <p className="text-sm font-bold mb-1">どれが合うかわからない？</p>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            相談内容が言語化できていなくても大丈夫です。お気軽にどうぞ。
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all press-in"
            style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
          >
            <Mail size={14} />
            お問い合わせ
          </Link>
        </section>

        {/* Footer */}
        <footer
          className="pt-8 pb-4 text-center border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Link
            to="/contact"
            className="text-xs font-bold transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
          >
            お問い合わせ
          </Link>
          <p className="font-mono text-xs mt-3" style={{ color: 'var(--color-text-muted)' }}>
            &copy; {new Date().getFullYear()} Yuta Kanehara
          </p>
        </footer>
      </main>
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function ServiceRow({ title, subtitle, items, href, to, linkLabel, providers }: {
  title: string;
  subtitle: string;
  items: string[];
  href?: string;
  to?: string;
  linkLabel?: string;
  providers?: { name: string; desc: string; link: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div
      className="group py-3 px-2 -mx-2 rounded-lg transition-colors cursor-pointer game-select"
      onClick={() => setIsOpen(!isOpen)}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-bold">{title}</span>
          <span className="font-mono text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs transition-transform duration-200"
            style={{
              color: 'var(--color-text-muted)',
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            ▶
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="mt-2 pl-1">
          <ul className="space-y-1 mb-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-accent)' }}>•</span>
                {item}
              </li>
            ))}
          </ul>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold"
              style={{ color: 'var(--color-accent)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {linkLabel || `${title}を開く`} <ExternalLink size={10} />
            </a>
          )}
          {to && (
            <Link
              to={to}
              className="inline-flex items-center gap-1 text-xs font-bold"
              style={{ color: 'var(--color-accent)' }}
              onClick={(e) => e.stopPropagation()}
            >
              お問い合わせ <ArrowRight size={10} />
            </Link>
          )}
          {providers && (
            <div className="mt-3">
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>以下の企業を通じてご相談ください</p>
              {providers.map((p, i) => (
                <a
                  key={i}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-xs font-bold" style={{ color: 'var(--color-accent)' }}>{p.name}</span>
                  <ExternalLink size={10} style={{ color: 'var(--color-text-muted)' }} className="flex-shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


