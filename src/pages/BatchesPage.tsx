import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Batch } from '../types';
import { getAllBatches, searchBatches } from '../services/api';
import { BatchCard } from '../components/BatchCard';
import { Carousel } from '../components/Carousel';

interface BatchesPageProps {
  onOpenBatch: (batchId: string) => void;
  onToast: (msg: string, isError?: boolean) => void;
}

export const BatchesPage: React.FC<BatchesPageProps> = ({ onOpenBatch, onToast }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Debounced search sync
  useEffect(() => {
    const handler = setTimeout(() => {
      setActiveQuery(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch batches when page or activeQuery changes
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const res = activeQuery.trim()
          ? await searchBatches(activeQuery, page)
          : await getAllBatches(page);

        if (cancelled) return;

        const newBatches = res.data || [];
        setBatches((prev) => (page === 1 ? newBatches : [...prev, ...newBatches]));
        setHasMore(res.currentPage < res.totalPages && newBatches.length > 0);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load batches:', err);
          onToast('Failed to load batches', true);
          if (page === 1) setBatches([]);
          setHasMore(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [activeQuery, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchQuery);
    setPage(1);
  };

  const normalBatches = batches.filter(
    (b) => !b.template || b.template === 'NORMAL' || b.template === 'DEFAULT'
  );

  return (
    <div className="container mx-auto px-3 sm:px-6 py-6 max-w-7xl">
      <div className="glass-card shadow-spring-sm border border-blue-500/15 !rounded-2xl p-4 sm:p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-blue-400">
          Batches
        </h1>

        {/* Search Bar matching original */}
        <form onSubmit={handleSearchSubmit} className="divshadow flex flex-wrap items-center gap-3 sm:gap-5 mb-2">
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <Search strokeWidth={2.5} className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow block w-full p-3.5 ps-10 text-sm divshadow border border-blue-500/20 dark:border-blue-500/25 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-hidden bg-white/80 dark:bg-black/40 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Search Your Batch"
            />
            <button
              type="submit"
              className="absolute end-2 top-2 bottom-2 font-semibold rounded-lg text-xs sm:text-sm px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-spring-sm hover:shadow-spring-md flex items-center justify-center cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Banners Carousel */}
        <Carousel />

        {/* Batches Grid */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            <BatchCard isPlaceholder />
            <BatchCard isPlaceholder />
            <BatchCard isPlaceholder />
          </div>
        ) : normalBatches.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {normalBatches.map((batch) => (
                <BatchCard
                  key={batch._id || batch.batchId}
                  id={batch.batchId || batch._id}
                  title={batch.batchName}
                  image={batch.batchImage}
                  type={batch.language || 'Hinglish'}
                  startDate={batch.startDate || 'Started'}
                  endDate={batch.endDate || 'Ongoing'}
                  price={batch.batchPrice ? batch.batchPrice.toFixed(0) : '0'}
                  forText={batch.byName || 'For Students'}
                  onOpen={onOpenBatch}
                  onToast={onToast}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => !loading && setPage((p) => p + 1)}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl border border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/10 font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Loading...' : 'Load More Batches'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
              No batches found.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Try searching with another keyword or explore popular batches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
