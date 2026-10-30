import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Trash2, Calendar, Target } from 'lucide-react';
import { DEFAULT_BATCH_BANNER, isBatchEnrolled, enrollBatch, unenrollBatch } from '../services/api';

interface BatchCardProps {
  id?: string;
  title?: string;
  type?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  price?: string;
  forText?: string;
  isPlaceholder?: boolean;
  onOpen?: (id: string) => void;
  onToast?: (msg: string, isError?: boolean) => void;
}

export const BatchCard: React.FC<BatchCardProps> = ({
  id = '',
  title = '',
  type = 'Hinglish',
  image,
  startDate = 'Date unavailable',
  endDate = 'Date unavailable',
  price = '0',
  forText = 'For Students',
  isPlaceholder = false,
  onOpen,
  onToast
}) => {
  const [enrolled, setEnrolled] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (isPlaceholder || !id) return;
    setEnrolled(isBatchEnrolled(id));

    const handleUpdate = () => {
      setEnrolled(isBatchEnrolled(id));
    };

    window.addEventListener('batchesUpdated', handleUpdate);
    return () => window.removeEventListener('batchesUpdated', handleUpdate);
  }, [id, isPlaceholder]);

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (enrolled) {
      unenrollBatch(id);
      onToast?.(`Unenrolled from "${title}".`);
    } else {
      enrollBatch({
        batchId: id,
        name: title,
        image: image || DEFAULT_BATCH_BANNER,
        byName: forText
      });
      onToast?.(`Successfully enrolled in "${title}"!`);
    }
  };

  // Skeleton placeholder state
  if (isPlaceholder) {
    return (
      <div className="glass-card !rounded-2xl p-4 space-y-4 animate-pulse">
        <div className="h-6 bg-muted-foreground/20 dark:bg-white/10 rounded-xl w-3/4" />
        <div className="h-44 bg-muted-foreground/20 dark:bg-white/10 rounded-xl" />
        <div className="h-4 bg-muted-foreground/20 dark:bg-white/10 rounded-xl w-1/2" />
        <div className="h-4 bg-muted-foreground/20 dark:bg-white/10 rounded-xl w-3/4" />
        <div className="flex gap-2">
          <div className="h-9 bg-muted-foreground/20 dark:bg-white/10 rounded-xl w-1/2" />
          <div className="h-9 bg-muted-foreground/20 dark:bg-white/10 rounded-xl w-1/2" />
        </div>
      </div>
    );
  }

  const displayImage = !imgError && image ? image : DEFAULT_BATCH_BANNER;

  return (
    <div
      onClick={() => onOpen?.(id)}
      className="glass-card !p-0 !rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-[3px] flex flex-col justify-between cursor-pointer border border-blue-500/20 dark:border-blue-500/25"
    >
      {/* Card Header Title */}
      <div className="p-4 pb-2 flex items-start justify-between gap-2">
        <h2 className="line-clamp-2 text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug">
          {title}
        </h2>
        <span className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-[11px] px-2 py-0.5 rounded-lg font-bold text-white shadow-xs">
          New
        </span>
      </div>

      {/* Card Image Banner */}
      <div className="px-4 pb-2">
        <div className="w-full rounded-xl overflow-hidden relative aspect-video bg-black/5 dark:bg-black/30 border border-blue-500/15">
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
          <div className="absolute bottom-2 left-2 z-10">
            <span className="rounded-lg bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white ring-1 ring-white/20">
              {type || 'Hinglish'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Details & Actions */}
      <div className="p-4 pt-1 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Target Audience / byName */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-xs">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-medium truncate">{forText}</span>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Starts:</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{startDate}</span>
            <span className="opacity-50">|</span>
            <span>Ends:</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{endDate}</span>
          </div>

          {/* Price & Free badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                ₹ FREE
              </span>
              {price && price !== '0' && (
                <span className="text-xs text-gray-400 line-through">₹{price}</span>
              )}
            </div>
            <span className="text-[11px] bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-lg font-semibold border border-blue-500/25">
              100% Free For Students
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.(id);
            }}
            className="flex-1 py-2 px-3 rounded-xl border border-blue-500/30 hover:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            Study
          </button>

          <button
            onClick={handleEnroll}
            className={`flex-1 py-2 px-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-btn-3d active:scale-95 cursor-pointer ${
              enrolled
                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
            }`}
          >
            {enrolled ? (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                Unenroll
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Enroll Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
