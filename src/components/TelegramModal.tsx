import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TELEGRAM_LINK } from '../services/api';

export const TelegramModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup once per session or on first visit
    const dismissed = sessionStorage.getItem('GB_TG_POPUP_DISMISSED');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('GB_TG_POPUP_DISMISSED', 'true');
  };

  const handleJoin = () => {
    window.open(TELEGRAM_LINK, '_blank', 'noopener,noreferrer');
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-blue-500/30 text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text text-transparent">
            Telegram Community !!
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telegram Banner Image */}
        <div className="my-3 rounded-2xl overflow-hidden border border-blue-500/20 shadow-md bg-black/5 dark:bg-black/30">
          <img
            src="/telegram-banner.png"
            alt="GB STUDY Telegram Community"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Message */}
        <div className="my-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium space-y-1">
          <p>Join The Channel For Latest Updates 👍</p>
          <p>Don't miss any Future updates!</p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleJoin}
          className="w-full py-3.5 px-6 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 hover:from-blue-700 hover:to-sky-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Join Now!
        </button>
      </div>
    </div>
  );
};
