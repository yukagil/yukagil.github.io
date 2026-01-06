import { Link } from 'react-router-dom';
import { Moon, Sun, Tent, ArrowRight, ArrowLeft, Mail } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  currentPage: 'home' | 'services' | 'projects' | 'contact';
}

export default function Header({ isDarkMode, onToggleTheme, currentPage }: HeaderProps) {
  return (
    <header className={`sticky top-0 z-50 border-b-4 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#0a0a0a]/95 border-cyan-500 shadow-[0_4px_20px_rgba(6,182,212,0.3)]' 
        : 'bg-white/95 border-black shadow-[0_4px_0_0_rgba(0,0,0,0.1)]'
    }`}>
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 transition-all flex-shrink-0 ${
              isDarkMode ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-blue-500 border-black text-white'
            }`}>
              <Tent size={18} />
            </span>
            <span className={`text-xl sm:text-2xl font-extrabold tracking-tighter ${
              isDarkMode ? 'text-cyan-400' : 'text-gray-900'
            }`}>
              Yuta<span className={isDarkMode ? 'text-pink-500' : 'text-red-500'}>.</span>Kanehara
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {currentPage === 'home' ? (
              <>
                <Link
                  to="/services"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                    isDarkMode
                      ? 'bg-purple-600 border-purple-400 text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]'
                      : 'bg-blue-500 border-black text-white hover:bg-blue-600 shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000]'
                  }`}
                >
                  <span>Services</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                    isDarkMode
                      ? 'bg-green-600 border-green-400 text-white hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                      : 'bg-green-500 border-black text-white hover:bg-green-600 shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000]'
                  }`}
                >
                  <Mail size={16} />
                  <span>Contact</span>
                </Link>
              </>
            ) : (
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                  isDarkMode
                    ? 'bg-gray-800 border-cyan-500 text-cyan-400 hover:bg-gray-700 shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'bg-white border-black text-gray-900 hover:bg-gray-50 shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000]'
                }`}
              >
                <ArrowLeft size={16} />
                <span>Home</span>
              </Link>
            )}
            
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg border-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none ${
                isDarkMode
                  ? 'bg-yellow-500 border-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:shadow-[0_0_20px_rgba(234,179,8,0.6)]'
                  : 'bg-yellow-400 border-black text-black shadow-[2px_2px_0_0_#000]'
              }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

