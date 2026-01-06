import { Link } from 'react-router-dom';

interface FooterProps {
  isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
  const buildYear = new Date().getFullYear();
  
  return (
    <footer className={`mt-20 relative ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`border-t-2 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-300'
      }`}></div>
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className={`text-sm font-bold font-mono ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            © {buildYear} Yuta Kanehara. All rights reserved.
          </p>
          <Link
            to="/contact"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
              isDarkMode
                ? 'bg-green-600 border-green-400 text-white hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                : 'bg-green-600 border-black text-white shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000]'
            }`}
          >
            お問い合わせ
          </Link>
        </div>
      </div>
    </footer>
  );
}

