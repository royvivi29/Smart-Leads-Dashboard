import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/70 dark:bg-[#0a0a0a]/70 border-b border-stone-200/50 dark:border-stone-800/50 backdrop-blur-xl shadow-sm transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-extrabold text-[1.2rem] tracking-tight text-stone-900 dark:text-stone-100 no-underline group">
          <div className="w-8 h-8 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-lg flex items-center justify-center text-white text-[0.75rem] font-black shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            SL
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-stone-900 to-stone-600 dark:from-white dark:to-stone-400">Smart Leads</span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            className="relative w-12 h-6 bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700/50 rounded-full cursor-pointer transition-colors flex items-center shadow-inner hover:shadow-md"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle theme"
            id="theme-toggle-btn"
          >
            <div className={`w-5 h-5 rounded-full absolute left-[2px] transition-transform duration-300 ease-in-out shadow-sm ${theme === 'dark' ? 'translate-x-[24px] bg-gradient-to-r from-orange-500 to-orange-400' : 'bg-white'}`} />
          </button>

          {user && (
            <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l sm:border-stone-200 dark:sm:border-stone-800/50">
              <span className="hidden md:inline-block text-[0.65rem] font-bold uppercase tracking-widest px-2 py-1 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                {user.role}
              </span>
              <div className="flex items-center gap-2.5 px-1.5 py-1.5 sm:pr-4 rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 cursor-pointer hover:bg-stone-50 dark:hover:bg-[#1a1917] transition-all duration-300 shadow-sm text-[0.85rem] font-semibold text-stone-700 dark:text-stone-300" title={user.email}>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-800/20 text-orange-600 dark:text-orange-400 flex items-center justify-center text-[0.7rem] font-black shrink-0 border border-orange-200/50 dark:border-orange-700/30">
                  {initials}
                </div>
                <span className="hidden sm:inline-block">{user.name.split(' ')[0]}</span>
              </div>
              <button
                className="hidden sm:block px-3 py-1.5 text-[0.85rem] font-bold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                onClick={handleLogout}
                id="logout-btn"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
