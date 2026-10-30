import React from 'react';
import { Heart, Sparkles, Send } from 'lucide-react';
import { TELEGRAM_LINK } from '../services/api';

export const DonatePage: React.FC = () => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Decorative Petals */}
      <div className="petal-particle" style={{ left: '10%', animationDuration: '28s', animationDelay: '0s' }} />
      <div className="petal-particle" style={{ left: '30%', animationDuration: '32s', animationDelay: '3s' }} />
      <div className="petal-particle" style={{ left: '55%', animationDuration: '30s', animationDelay: '7s' }} />
      <div className="petal-particle" style={{ left: '75%', animationDuration: '35s', animationDelay: '2s' }} />
      <div className="petal-particle" style={{ left: '90%', animationDuration: '26s', animationDelay: '5s' }} />

      <div className="relative z-10 max-w-xl w-full glass-card p-6 sm:p-8 rounded-3xl border border-blue-500/25 shadow-glass-lg text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 flex items-center justify-center shadow-md animate-float">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400">
            Support Education For Everyone
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            Donate Batch & Support
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
            GB STUDY is dedicated to making quality education 100% free and accessible for all students.
            If you have access to any course or want to contribute to server costs and help thousands of learners, reach out to us!
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 text-left space-y-2">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            How You Can Help:
          </div>
          <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Share active batches or notes to help fellow aspirants</li>
            <li>Report broken video links or missing lectures</li>
            <li>Share GB STUDY channel with friends in need</li>
          </ul>
        </div>

        <a
          href={TELEGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-btn-3d active:scale-95 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4 fill-white" />
          Contact Admin on Telegram @GBFreestudy
        </a>
      </div>
    </div>
  );
};
