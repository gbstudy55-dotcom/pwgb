import React, { useState, useEffect } from 'react';
import { BookOpen, Trash2, ArrowRight } from 'lucide-react';
import { getEnrolledBatches, unenrollBatch, EnrolledBatch, DEFAULT_BATCH_BANNER } from '../services/api';

interface MyBatchesPageProps {
  onOpenBatch: (batchId: string) => void;
  onExplore: () => void;
  onToast: (msg: string, isError?: boolean) => void;
}

export const MyBatchesPage: React.FC<MyBatchesPageProps> = ({
  onOpenBatch,
  onExplore,
  onToast
}) => {
  const [batches, setBatches] = useState<EnrolledBatch[]>([]);

  const refreshList = () => {
    setBatches(getEnrolledBatches());
  };

  useEffect(() => {
    refreshList();
    window.addEventListener('batchesUpdated', refreshList);
    return () => window.removeEventListener('batchesUpdated', refreshList);
  }, []);

  const handleUnenroll = (batchId: string, name: string) => {
    unenrollBatch(batchId);
    onToast(`Unenrolled from "${name}".`);
    refreshList();
  };

  return (
    <div className="container mx-auto px-3 sm:px-6 py-6 max-w-7xl">
      <div className="glass-card shadow-spring-sm border border-blue-500/15 !rounded-2xl p-4 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-400">
              My Batches
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your active enrolled study batches ({batches.length})
            </p>
          </div>

          <button
            onClick={onExplore}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            Explore More Batches
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {batches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {batches.map((b) => (
              <div
                key={b.batchId}
                className="glass-card !p-0 !rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-[3px] flex flex-col justify-between border border-blue-500/15"
              >
                <div className="p-4 pb-2">
                  <h2 className="line-clamp-2 text-base font-bold text-gray-900 dark:text-gray-100">
                    {b.name}
                  </h2>
                </div>

                <div className="px-4 pb-2">
                  <div className="w-full rounded-xl overflow-hidden aspect-video bg-black/5 dark:bg-black/30 border border-blue-500/10">
                    <img
                      src={b.image || DEFAULT_BATCH_BANNER}
                      alt={b.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="p-4 pt-1 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      ✓ Enrolled & Ready
                    </span>
                    {b.enrolledAt && (
                      <span>{new Date(b.enrolledAt).toLocaleDateString()}</span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onOpenBatch(b.batchId)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-btn-3d active:scale-95 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      Study Now
                    </button>

                    <button
                      onClick={() => handleUnenroll(b.batchId, b.name)}
                      className="p-2 rounded-xl border border-red-500/30 hover:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold text-xs transition-colors cursor-pointer"
                      title="Unenroll"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="text-6xl mb-4 animate-float">📚</div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Not enrolled in any batch
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
              Explore our wide variety of courses for IIT-JEE, NEET, Board exams, and more to start learning today.
            </p>
            <button
              onClick={onExplore}
              className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-spring-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              Browse Batches
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
