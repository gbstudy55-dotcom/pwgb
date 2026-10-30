import React, { useState } from 'react';
import { X, Play, Maximize, Volume2, Settings, ArrowLeft } from 'lucide-react';
import { TopicItem } from '../types';

interface WatchModalProps {
  topic: TopicItem | null;
  onClose: () => void;
}

export const WatchModal: React.FC<WatchModalProps> = ({ topic, onClose }) => {
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  if (!topic) return null;

  const title = topic.topic || 'Video Lecture';
  const duration = topic.videoDetails?.duration || '';
  const thumbnail =
    topic.videoDetails?.image ||
    'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/17269a0b-7739-4e6b-b9c7-c4f4939d303e.png';

  const speeds = [0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-gray-900 border border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto text-white">
        {/* Top Header */}
        <div className="p-3 sm:p-4 bg-gray-950/80 border-b border-gray-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
            GB STUDY PLAYER
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-contain opacity-60"
          />

          {/* Playing Simulation Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
            <p className="mt-4 text-xs sm:text-sm font-semibold tracking-wide text-blue-300 bg-black/60 px-4 py-1.5 rounded-full border border-blue-500/30">
              Streaming High Quality • {duration || 'Full Session'}
            </p>
          </div>

          {/* Player Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
              </button>
              <Volume2 className="w-4 h-4 text-gray-300" />
              <span className="font-mono text-gray-300">00:00 / {duration || '01:30:00'}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Playback speed buttons */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
                {speeds.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      speed === s ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <span className="flex items-center gap-1 text-[11px] text-blue-400">
                <Settings className="w-3.5 h-3.5" /> 720p HD
              </span>
              <Maximize className="w-4 h-4 cursor-pointer text-gray-300 hover:text-white" />
            </div>
          </div>
        </div>

        {/* Info below player */}
        <div className="p-4 sm:p-5 bg-gray-900 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
            {title}
          </h2>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 pt-2 border-t border-gray-800">
            <span>Powered by GB STUDY Learning Engine</span>
            <a
              href="https://t.me/GBFreestudy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-semibold"
            >
              Need help? Join @GBFreestudy on Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
