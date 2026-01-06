import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SectionTitle from './components/SectionTitle';
import { Users } from 'lucide-react';

interface ContactProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export default function Contact({ isDarkMode, setIsDarkMode }: ContactProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0a0a0a] text-gray-100' : 'bg-white text-gray-900'
    }`}>
      <Header 
        isDarkMode={isDarkMode} 
        onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
        currentPage="contact"
      />

      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Contact Form Section */}
        <section className="mb-20 scroll-mt-24" id="contact-form">
          <div className="mb-8">
            <SectionTitle title="お問い合わせ" icon={<Users size={24} />} isDarkMode={isDarkMode} />
          </div>
          <div className={`p-6 rounded-2xl border-2 ${
            isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-black shadow-[4px_4px_0_0_#000]'
          }`}>
            {isSubmitted ? (
              <div className={`p-8 rounded-xl border-2 text-center ${
                isDarkMode ? 'bg-green-900/20 border-green-600' : 'bg-green-50 border-green-600'
              }`}>
                <p className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                  お問い合わせありがとうございます
                </p>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  内容を確認次第、ご連絡いたします。
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  お問い合わせの内容によっては、返信ができない場合もございます。あらかじめご了承ください。
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
                      // フォームをリセット
                      const form = document.querySelector('form[target="hidden_iframe"]') as HTMLFormElement;
                      if (form) form.reset();
                    };
                  }
                }}
                className="space-y-6"
              >
                {/* お名前 */}
                <div>
                  <label 
                    htmlFor="field-name" 
                    className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
                  >
                    お名前 <span className={`text-xs font-normal ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>*</span>
                  </label>
                  <input
                    type="text"
                    id="field-name"
                    name="entry.356289134"
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500/20' 
                        : 'bg-white border-black text-gray-900 focus:border-blue-600 focus:ring-blue-600/20'
                    }`}
                    placeholder="お名前を入力してください"
                  />
                </div>

                {/* 会社名 */}
                <div>
                  <label 
                    htmlFor="field-company" 
                    className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
                  >
                    会社名
                    <span className={`text-xs font-normal ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      （特定企業に紐づかない個人的な相談の場合は記載不要です）
                    </span>
                  </label>
                  <input
                    type="text"
                    id="field-company"
                    name="entry.1060507538"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500/20' 
                        : 'bg-white border-black text-gray-900 focus:border-blue-600 focus:ring-blue-600/20'
                    }`}
                    placeholder="会社名を入力してください（任意）"
                  />
                </div>

                {/* ご連絡先 */}
                <div>
                  <label 
                    htmlFor="field-contact" 
                    className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
                  >
                    ご連絡先 <span className={`text-xs font-normal ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>*</span>
                    <span className={`text-xs font-normal ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      （SNSの場合はプロフィールページのURLをおしえてください）
                    </span>
                  </label>
                  <input
                    type="text"
                    id="field-contact"
                    name="entry.1020997844"
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500/20' 
                        : 'bg-white border-black text-gray-900 focus:border-blue-600 focus:ring-blue-600/20'
                    }`}
                    placeholder="メールアドレスまたはSNSのURLを入力してください"
                  />
                </div>

                {/* お問い合わせ内容 */}
                <div>
                  <label 
                    htmlFor="field-message" 
                    className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
                  >
                    お問い合わせ内容 <span className={`text-xs font-normal ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>*</span>
                  </label>
                  <textarea
                    id="field-message"
                    name="entry.243889220"
                    required
                    rows={6}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500/20' 
                        : 'bg-white border-black text-gray-900 focus:border-blue-600 focus:ring-blue-600/20'
                    }`}
                    placeholder="お問い合わせ内容を入力してください"
                  />
                </div>

                {/* 送信ボタン */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className={`px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-500 text-white border-2 border-blue-600 hover:border-blue-500'
                        : 'bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 hover:border-blue-700 shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5'
                    }`}
                  >
                    送信する
                  </button>
                </div>
              </form>
            )}
            <iframe
              id="hidden_iframe"
              name="hidden_iframe"
              style={{ display: 'none' }}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

