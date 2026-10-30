import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, FileText, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { TopicItem } from '../types';
import { getTopicContents, getSubjectChapters, getBatchDetails } from '../services/api';

interface ChapterTopicsPageProps {
  batchId: string;
  subjectSlug: string;
  topicSlug: string;
  chapterTitle?: string;
  onPlayVideo: (topic: TopicItem) => void;
  onViewNotes: (noteUrl: string, title: string) => void;
  onBack: () => void;
  onToast: (msg: string, isError?: boolean) => void;
}

export const ChapterTopicsPage: React.FC<ChapterTopicsPageProps> = ({
  batchId,
  subjectSlug,
  topicSlug,
  chapterTitle = 'Chapter',
  onPlayVideo,
  onViewNotes,
  onBack,
  onToast
}) => {
  const [items, setItems] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'lectures' | 'notes' | 'dpps'>('all');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // Resolve subjectId & chapterId
        let sId = subjectSlug;
        const details = await getBatchDetails(batchId);
        if (details?.subjects) {
          const matched = details.subjects.find(
            (s) => s.slug === subjectSlug || s._id === subjectSlug
          );
          if (matched) sId = matched._id;
        }

        let cId = topicSlug;
        const chapters = await getSubjectChapters(batchId, sId);
        const matchedChapter = chapters.find(
          (c) => c.slug === topicSlug || c._id === topicSlug
        );
        if (matchedChapter) cId = matchedChapter._id;

        const data = await getTopicContents(batchId, sId, cId, activeFilter);
        if (cancelled) return;
        setItems(data);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          onToast('Failed to load topic contents', true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [batchId, subjectSlug, topicSlug, activeFilter]);

  return (
    <div className="container mx-auto px-3 sm:px-6 py-6 max-w-5xl">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Chapters
      </button>

      {/* Header */}
      <div className="glass-card !rounded-2xl p-5 mb-6 border border-blue-500/20">
        <p className="text-xs uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
          Chapter Lectures & Materials
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
          {chapterTitle}
        </h1>
      </div>

      {/* Filter Tabs matching original */}
      <div className="flex gap-2 border-b border-blue-500/20 mb-6 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('lectures')}
          className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'lectures'
              ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
          }`}
        >
          Lectures
        </button>
        <button
          onClick={() => setActiveFilter('notes')}
          className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'notes'
              ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
          }`}
        >
          Notes
        </button>
        <button
          onClick={() => setActiveFilter('dpps')}
          className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'dpps'
              ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600'
          }`}
        >
          DPP
        </button>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-4 rounded-xl flex gap-4 animate-pulse">
              <div className="w-32 h-20 bg-muted-foreground/20 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted-foreground/20 rounded-sm w-3/4" />
                <div className="h-4 bg-muted-foreground/20 rounded-sm w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => {
            const hasVideo = !!item.videoDetails || item.isVideoLecture;
            const hasNotes = item.homeworkIds && item.homeworkIds.length > 0;
            const hasDPP = item.exerciseIds && item.exerciseIds.length > 0;
            const thumbnail =
              item.videoDetails?.image ||
              'https://static.pw.live/5eb393ee95fab7468a79d189/ADMIN/17269a0b-7739-4e6b-b9c7-c4f4939d303e.png';

            return (
              <div
                key={item._id}
                className="glass-card p-4 rounded-2xl border border-blue-500/15 hover:shadow-spring-sm transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                {/* Left side: Thumbnail & Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    onClick={() => onPlayVideo(item)}
                    className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden shrink-0 bg-black/10 cursor-pointer group border border-blue-500/20"
                  >
                    <img
                      src={thumbnail}
                      alt={item.topic}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h3
                      onClick={() => onPlayVideo(item)}
                      className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-2"
                    >
                      {item.topic}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {item.videoDetails?.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          {item.videoDetails.duration}
                        </span>
                      )}
                      {item.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {hasVideo && (
                    <button
                      onClick={() => onPlayVideo(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Watch
                    </button>
                  )}

                  {hasNotes && (
                    <button
                      onClick={() => {
                        const note = item.homeworkIds?.[0];
                        const noteUrl = note?.attachmentIds?.[0]?.baseUrl
                          ? `${note.attachmentIds[0].baseUrl}${note.attachmentIds[0].key || ''}`
                          : '';
                        onViewNotes(noteUrl, note?.topic || item.topic);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500/30 hover:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Notes
                    </button>
                  )}

                  {hasDPP && (
                    <button
                      onClick={() => {
                        const dpp = item.exerciseIds?.[0];
                        onToast(`Opening DPP: ${dpp?.title || 'Quiz'}`);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500/30 hover:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      DPP
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-10 text-center text-gray-500">
          No content found in this category.
        </div>
      )}
    </div>
  );
};
