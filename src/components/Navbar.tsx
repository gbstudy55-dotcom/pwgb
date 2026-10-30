import React, { useState, useEffect, useRef } from 'react';
import { Menu, ChevronLeft, Sun, Moon, Laptop, ShieldCheck, LogOut, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onBack: () => void;
  canGoBack: boolean;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onBack,
  canGoBack,
  onToggleMobileMenu
}) => {
  const [theme, setTheme] = useState<'LIGHT' | 'DARK' | 'SYSTEM'>('LIGHT');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('GB Student');

  const themeRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('USER_THEME');
    if (saved === 'DARK' || saved === 'LIGHT' || saved === 'SYSTEM') {
      setTheme(saved);
    } else {
      setTheme('LIGHT');
    }

    const userData = localStorage.getItem('USER_DATA');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.name) setUserName(parsed.name);
      } catch {
        // ignore
      }
    }
  }, []);

  // Apply theme to html root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'DARK') {
      root.classList.add('dark');
    } else if (theme === 'LIGHT') {
      root.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    }
    localStorage.setItem('USER_THEME', theme);
  }, [theme]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('USER_DATA');
    setUserName('GB Student');
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 glass-navbar bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-600/10 dark:to-indigo-600/10 border-b border-blue-500/10 dark:border-blue-500/20 shadow-spring-sm px-3 sm:px-6 py-2.5 flex items-center justify-between">
      {/* Left side: Mobile Toggle & Back Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMobileMenu}
          className="xl:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-500/10 dark:hover:bg-blue-400/10 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {canGoBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl hover:bg-blue-500/10 dark:hover:bg-blue-400/10 text-blue-700 dark:text-blue-300 transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}
      </div>

      {/* Right side: Key status, Theme Toggle, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Verification status pill */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs transition-all duration-300 border bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300"
          title="GB STUDY verified access active"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline text-[11px] opacity-80">Access:</span>
          <span className="font-mono tracking-tight font-bold">FREE ALL</span>
        </div>

        {/* Theme Dropdown */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="p-2 rounded-xl hover:bg-blue-500/10 dark:hover:bg-blue-400/10 text-gray-700 dark:text-gray-300 transition-colors"
            title="Switch theme"
          >
            {theme === 'LIGHT' ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : theme === 'DARK' ? (
              <Moon className="h-5 w-5 text-blue-400" />
            ) : (
              <Laptop className="h-5 w-5 text-blue-500" />
            )}
          </button>

          {themeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl glass-card border border-blue-500/20 dark:border-blue-500/30 shadow-spring-md py-1.5 z-50 text-sm">
              <button
                onClick={() => {
                  setTheme('LIGHT');
                  setThemeDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-500/10 dark:hover:bg-blue-400/10 ${
                  theme === 'LIGHT' ? 'text-amber-500 font-semibold' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                Light
              </button>
              <button
                onClick={() => {
                  setTheme('DARK');
                  setThemeDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-500/10 dark:hover:bg-blue-400/10 ${
                  theme === 'DARK' ? 'text-blue-400 font-semibold' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Moon className="w-4 h-4 text-blue-400" />
                Dark
              </button>
              <button
                onClick={() => {
                  setTheme('SYSTEM');
                  setThemeDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-500/10 dark:hover:bg-blue-400/10 ${
                  theme === 'SYSTEM' ? 'text-blue-500 font-semibold' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Laptop className="w-4 h-4 text-blue-500" />
                System
              </button>
            </div>
          )}
        </div>

        {/* Greeting text */}
        <span className="hidden sm:inline truncate max-w-40 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200">
          Hi, {userName}
        </span>

        {/* User avatar & dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-300 overflow-hidden"
          >
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 text-white font-bold text-sm">
              GB
            </div>
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl glass-card border border-blue-500/20 dark:border-blue-500/30 shadow-spring-md py-1.5 z-50 text-sm">
              <div className="px-3 py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">GB STUDY Scholar</p>
              </div>
              <button
                onClick={() => {
                  const newName = prompt('Enter your name:', userName);
                  if (newName && newName.trim()) {
                    setUserName(newName.trim());
                    localStorage.setItem('USER_DATA', JSON.stringify({ name: newName.trim() }));
                  }
                  setUserDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-blue-500/10 dark:hover:bg-blue-400/10"
              >
                <RefreshCw className="w-4 h-4 text-blue-500" />
                Change Name
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-500 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                Reset Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
