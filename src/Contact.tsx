import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from './components/SEO';
import { ArrowLeft } from 'lucide-react';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inputStyle = {
    backgroundColor: 'var(--color-surface)',
    border: `1px solid var(--color-border)`,
    color: 'var(--color-text)',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <SEO
        title="Contact | Yuta Kanehara"
        description="お気軽にご連絡ください"
        path="/contact"
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
            className="flex items-center gap-1.5 text-sm font-bold"
            style={{ color: 'var(--color-text)' }}
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>
      </header>

      <main className="max-w-[640px] mx-auto px-4 pt-10 pb-16">
        <div className="mb-8 animate-enter">
          <h1 className="font-display text-2xl font-bold mb-2">お問い合わせ</h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            内容を確認次第、ご連絡いたします。
          </p>
        </div>

        <div
          className="p-6 rounded-xl animate-enter animate-enter-delay-1"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: `1px solid var(--color-border)`,
          }}
        >
          {isSubmitted ? (
            <div className="text-center py-8">
              <p className="font-display text-lg font-bold mb-2" style={{ color: 'var(--color-accent)' }}>
                お問い合わせありがとうございます
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                内容を確認次第、ご連絡いたします。
              </p>
              <p className="text-xs mt-4" style={{ color: 'var(--color-text-muted)' }}>
                お問い合わせの内容によっては、返信ができない場合もございます。
              </p>
            </div>
          ) : (
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
                  style={{ ...inputStyle, '--tw-ring-color': 'var(--color-accent)' } as any}
                  placeholder="お名前を入力してください"
                />
              </div>

              <div>
                <label htmlFor="field-company" className="block text-sm font-bold mb-1.5">
                  会社名
                  <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>
                    （個人的な相談の場合は記載不要）
                  </span>
                </label>
                <input
                  type="text"
                  id="field-company"
                  name="entry.1060507538"
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ ...inputStyle, '--tw-ring-color': 'var(--color-accent)' } as any}
                  placeholder="会社名を入力してください（任意）"
                />
              </div>

              <div>
                <label htmlFor="field-contact" className="block text-sm font-bold mb-1.5">
                  ご連絡先 <span className="text-xs" style={{ color: 'var(--color-accent)' }}>*</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>
                    （SNSの場合はプロフィールURLを）
                  </span>
                </label>
                <input
                  type="text"
                  id="field-contact"
                  name="entry.1020997844"
                  required
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ ...inputStyle, '--tw-ring-color': 'var(--color-accent)' } as any}
                  placeholder="ご連絡先を入力してください"
                />
              </div>

              <div>
                <label htmlFor="field-message" className="block text-sm font-bold mb-1.5">
                  お問い合わせ内容 <span className="text-xs" style={{ color: 'var(--color-accent)' }}>*</span>
                </label>
                <textarea
                  id="field-message"
                  name="entry.243889220"
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{ ...inputStyle, '--tw-ring-color': 'var(--color-accent)' } as any}
                  placeholder="お問い合わせ内容を入力してください"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold text-sm transition-all press-in"
                  style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
                >
                  送信する
                </button>
              </div>
            </form>
          )}
          <iframe
            id="hidden_iframe"
            name="hidden_iframe"
            title="Form submission target"
            style={{ display: 'none' }}
          />
        </div>

        {/* Footer */}
        <footer
          className="pt-12 pb-4 text-center border-t mt-16"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
            &copy; {new Date().getFullYear()} Yuta Kanehara
          </p>
        </footer>
      </main>
    </div>
  );
}
