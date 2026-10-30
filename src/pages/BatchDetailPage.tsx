import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Target, FileText, Bell, CheckCircle, Trash2, ArrowLeft } from 'lucide-react';
import { BatchDetails, Subject, Announcement, TestItem } from '../types';
import { getBatchDetails, getBatchAnnouncements, getTests, isBatchEnrolled, enrollBatch, unenrollBatch, DEFAULT_BATCH_BANNER } from '../services/api';

interface BatchDetailPageProps {
  batchId: string;
  onSelectSubject: (batchId: string, subjectSlug: string, subjectTitle: string) => void;
  onBack: () => void;
  onToast: (msg: string, isError?: boolean) => void;
}

export const BatchDetailPage: React.FC<BatchDetailPageProps> = ({
  batchId,
  onSelectSubject,
  onBack,
  onToast
}) => {
  const [batch, setBatch] = useState<BatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'classes' | 'tests' | 'announcements'>('classes');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const details = await getBatchDetails(batchId);
        if (cancelled) return;
        setBatch(details);
        setEnrolled(isBatchEnrolled(batchId));

        // Load announcements and tests in parallel
        const [annRes, testsRes] = await Promise.all([
          getBatchAnnouncements(batchId),
          getTests(batchId)
        ]);
        if (cancelled) return;
        setAnnouncements(annRes);
        setTests(testsRes);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          onToast('Failed to load batch details', true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    const handleUpdate = () => setEnrolled(isBatchEnrolled(batchId));
    window.addEventListener('batchesUpdated', handleUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener('batchesUpdated', handleUpdate);
    };
  }, [batchId]);

  const handleEnrollToggle = () => {
    if (!batch) return;
    if (enrolled) {
      unenrollBatch(batchId);
      onToast(`Unenrolled from "${batch.batchName || batch.name}".`);
    } else {
      enrollBatch({
        batchId,
        name: batch.batchName || batch.name || 'Batch',
        image: batch.batchImage,
        byName: batch.byName
      });
      onToast(`Enrolled in "${batch.batchName || batch.name}" successfully!`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-pulse space-y-6">
        <div className="h-60 bg-muted-foreground/20 dark:bg-white/10 rounded-2xl" />
        <div className="h-10 bg-muted-foreground/20 dark:bg-white/10 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-28 bg-muted-foreground/20 dark:bg-white/10 rounded-xl" />
          <div className="h-28 bg-muted-foreground/20 dark:bg-white/10 rounded-xl" />
          <div className="h-28 bg-muted-foreground/20 dark:bg-white/10 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">Batch details not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer"
        >
          Return to Batches
        </button>
      </div>
    );
  }

  const batchName = batch.batchName || batch.name || 'Batch';
  const subjects = batch.subjects || [];

  return (
    <div className="container mx-auto px-3 sm:px-6 py-6 max-w-7xl">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Batches
      </button>

      {/* Batch Hero Banner Card */}
      <div className="glass-card !rounded-2xl p-4 sm:p-6 mb-6 overflow-hidden border border-blue-500/20">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-72 h-44 rounded-xl overflow-hidden shrink-0 bg-black/10 border border-blue-500/15">
            <img
              src={batch.batchImage || DEFAULT_BATCH_BANNER}
              alt={batchName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {batchName}
              </h1>
              <span className="text-xs bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold px-3 py-1 rounded-full border border-blue-500/25">
                {batch.language || 'Hinglish'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{batch.byName || 'Complete Preparation'}</span>
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                {batch.startDate || 'Started'} — {batch.endDate || 'Ongoing'}
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                • 100% Free Access
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleEnrollToggle}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-btn-3d active:scale-95 cursor-pointer ${
                  enrolled
                    ? 'bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 border border-red-500/30'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}
              >
                {enrolled ? (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Unenroll from Batch
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Enroll In Batch
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b border-blue-500/20 mb-6 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('classes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'classes'
              ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-blue-500/5'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Classes ({subjects.length})
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'tests'
              ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-blue-500/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          Tests ({tests.length})
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-blue-500/5'
          }`}
        >
          <Bell className="w-4 h-4" />
          Announcements ({announcements.length})
        </button>
      </div>

      {/* Tab: Classes / Subjects Grid */}
      {activeTab === 'classes' && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-blue-400">
            Subjects
          </h2>

          {subjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {subjects.map((sub: Subject) => {
                const subImg = sub.imageId
                  ? `${sub.imageId.baseUrl || ''}${sub.imageId.key || ''}`
                  : null;

                const teacher = sub.teacherIds?.[0];
                const teacherName = teacher
                  ? `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim()
                  : null;

                return (
                  <div
                    key={sub._id}
                    onClick={() =>
                      onSelectSubject(
                        batch.batchId || batch._id || batchId,
                        sub.slug || sub._id,
                        sub.subject
                      )
                    }
                    className="flex items-center gap-4 bg-white/90 dark:bg-black/40 border border-blue-500/15 dark:border-blue-500/20 rounded-xl p-4 hover:shadow-spring-md hover:-translate-y-0.5 cursor-pointer divshadow transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-blue-500/10 flex items-center justify-center p-1 border border-blue-500/20">
                      {subImg ? (
                        <img
                          src={subImg}
                          alt={sub.subject}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">
                        {sub.subject}
                      </p>
                      {teacherName && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {teacherName}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">
                        {sub.tagCount || 0} Chapters
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card p-8 text-center text-gray-500">
              No subjects listed for this batch yet.
            </div>
          )}
        </div>
      )}

      {/* Tab: Tests */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-blue-400">
            Tests & Assessments
          </h2>

          {tests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tests.map((test) => (
                <div
                  key={test._id}
                  className="glass-card p-4 rounded-xl border border-blue-500/15 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">
                      {test.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Marks: {test.totalMarks || 100} • Questions: {test.totalQuestions || 25}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Free
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center text-gray-500">
              No tests scheduled currently.
            </div>
          )}
        </div>
      )}

      {/* Tab: Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-blue-400">
            📢 Announcements
          </h2>

          {announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div
                  key={ann._id}
                  className="glass-card p-5 rounded-xl border border-blue-500/15 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                      {ann.title || 'Faculty Announcement'}
                    </h3>
                    {ann.createdAt && (
                      <span className="text-xs text-gray-400">
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {ann.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center text-gray-500">
              No recent announcements.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
