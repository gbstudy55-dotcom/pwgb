import React from 'react';
import {
  GraduationCap,
  Layers,
  BookmarkCheck,
  Send,
  HeartHandshake,
  Headphones,
  X
} from 'lucide-react';
import { APP_NAME, TELEGRAM_LINK, APP_LOGO, FALLBACK_LOGO } from '../services/api';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  const [logoError, setLogoError] = React.useState(false);

  const navItems = [
    { id: 'study', text: 'Study', path: '/study', icon: GraduationCap, isExternal: false },
    { id: 'batches', text: 'Batches', path: '/study/batches', icon: Layers, isExternal: false },
    { id: 'mybatches', text: 'My Batches', path: '/study/mybatches', icon: BookmarkCheck, isExternal: false },
    { id: 'telegram', text: 'Join Telegram', path: TELEGRAM_LINK, icon: Send, isExternal: true },
    { id: 'donate', text: 'Donate Batch', path: '/study/donate', icon: HeartHandshake, isExternal: false },
    { id: 'contact', text: 'Contact Us', path: '/contact', icon: Headphones, isExternal: false },
  ];

  const isActive = (itemPath: string) => {
    if (itemPath === '/study') return currentPath === '/study' || currentPath === '/study/';
    if (itemPath === '/study/batches') return currentPath === '/study/batches' || currentPath.startsWith('/study/batches/');
    if (itemPath === '/study/mybatches') return currentPath === '/study/mybatches';
    return currentPath === itemPath;
  };

  const handleItemClick = (item: typeof navItems[0]) => {
    setIsMobileMenuOpen(false);
    if (item.isExternal) {
      window.open(item.path, '_blank', 'noopener,noreferrer');
    } else {
      onNavigate(item.path);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 xl:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`z-50 w-64 bg-gradient-to-b from-blue-950/80 to-[#070d19] border-r border-blue-500/15 dark:border-blue-500/20 backdrop-blur-md transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'fixed top-0 left-0 translate-x-0 h-full' : 'fixed top-0 left-0 -translate-x-full h-full'
        } xl:sticky xl:top-0 xl:translate-x-0 xl:h-screen xl:z-30 shrink-0 flex flex-col`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-blue-500/15 dark:border-blue-500/20 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('/study/batches')}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500/40 bg-white/80 dark:bg-black/40 flex items-center justify-center p-0.5 shadow-sm">
              <img
                src={logoError ? FALLBACK_LOGO : APP_LOGO}
                alt={APP_NAME}
                className="w-full h-full object-cover rounded-full"
                onError={() => setLogoError(true)}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
              <span className="text-blue-400 text-base">📘</span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            className="xl:hidden p-1.5 rounded-lg text-gray-500 hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1.5 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const active = !item.isExternal && isActive(item.path);
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm transition-all duration-200 select-none ${
                  active
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-spring-sm font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10'
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }`}
                />
                <span className="font-medium flex-1">{item.text}</span>
                {item.isExternal && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    TG
                  </span>
                )}
                {active && <span className="text-sm">⚡</span>}
              </div>
            );
          })}
        </nav>

        {/* Telegram Quick Banner in Sidebar footer */}
        <div className="p-3 border-t border-blue-500/15 dark:border-blue-500/20">
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            Join Telegram @GBFreestudy
          </a>
        </div>
      </aside>
    </>
  );
};
