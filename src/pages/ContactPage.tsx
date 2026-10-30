import React from 'react';
import { Send, Mail, ShieldAlert } from 'lucide-react';
import { APP_NAME, TELEGRAM_LINK } from '../services/api';

export const ContactPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 text-center animate-fadeSlideUp">
      <div className="bg-gray-800/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-6 sm:p-10 max-w-xl w-full border border-blue-600/40 backdrop-blur-md">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-blue-400">
          Contact & Info
        </h2>

        <p className="mb-6 text-sm sm:text-base text-gray-200 leading-relaxed">
          <span className="font-semibold text-blue-300">{APP_NAME}</span> is your
          all-in-one study companion, designed to help you learn, code, and grow.
          Our platform offers curated study materials, interactive tools, and a
          supportive community to empower your learning journey.
        </p>

        <ul className="mb-8 text-left text-gray-300 space-y-3 bg-gray-900/60 p-4 rounded-xl border border-gray-700/50 text-sm">
          <li className="flex items-center justify-between">
            <span className="font-semibold text-blue-400">Official Channel:</span>
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline font-mono"
            >
              @GBFreestudy
            </a>
          </li>
          <li className="flex items-center justify-between">
            <span className="font-semibold text-blue-400">Community Support:</span>
            <span className="text-gray-300 font-mono">Available 24/7 on Telegram</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="font-semibold text-blue-400">Content Policy:</span>
            <span className="text-gray-300">Free educational access</span>
          </li>
        </ul>

        <div className="flex flex-col items-center gap-4">
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition font-semibold text-base shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Send className="w-5 h-5 fill-white" />
            Join Telegram Channel
          </a>

          <p className="text-xs text-gray-400 mt-2">
            For support, feedback, or batch queries, reach out through our official Telegram.
          </p>
        </div>
      </div>
    </div>
  );
};
