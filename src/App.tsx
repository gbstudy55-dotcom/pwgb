import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { BatchesPage } from './pages/BatchesPage';
import { BatchDetailPage } from './pages/BatchDetailPage';
import { SubjectPage } from './pages/SubjectPage';
import { ChapterTopicsPage } from './pages/ChapterTopicsPage';
import { MyBatchesPage } from './pages/MyBatchesPage';
import { DonatePage } from './pages/DonatePage';
import { ContactPage } from './pages/ContactPage';
import { WatchModal } from './components/WatchModal';
import { TopicItem } from './types';
import { Check, X } from 'lucide-react';
import { TelegramModal } from './components/TelegramModal';

interface ToastState {
  id: number;
  message: string;
  isError?: boolean;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState('/study/batches');
  const [history, setHistory] = useState<string[]>(['/study/batches']);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active item route parameters
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string | null>(null);
  const [selectedSubjectTitle, setSelectedSubjectTitle] = useState<string>('');
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string | null>(null);
  const [selectedChapterTitle, setSelectedChapterTitle] = useState<string>('');

  // Active modals
  const [activeVideoTopic, setActiveVideoTopic] = useState<TopicItem | null>(null);
  const [activeNote, setActiveNote] = useState<{ url: string; title: string } | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, isError = false) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, isError }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setHistory((prev) => [...prev, path]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // remove current
      const prevPath = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentPath(prevPath);
    } else {
      navigateTo('/study/batches');
    }
  };

  const handleOpenBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
    navigateTo(`/study/batches/${batchId}`);
  };

  const handleSelectSubject = (batchId: string, subjectSlug: string, subjectTitle: string) => {
    setSelectedBatchId(batchId);
    setSelectedSubjectSlug(subjectSlug);
    setSelectedSubjectTitle(subjectTitle);
    navigateTo(`/study/batches/${batchId}/subjects/${subjectSlug}`);
  };

  const handleSelectChapter = (topicSlug: string, chapterTitle: string) => {
    setSelectedTopicSlug(topicSlug);
    setSelectedChapterTitle(chapterTitle);
    if (selectedBatchId && selectedSubjectSlug) {
      navigateTo(`/study/batches/${selectedBatchId}/subjects/${selectedSubjectSlug}/subject-topics/${topicSlug}`);
    }
  };

  // Sync with browser URL / history if wanted
  useEffect(() => {
    // Initial path sync
    const path = window.location.pathname;
    if (path && path !== '/' && path !== '') {
      setCurrentPath(path);
      setHistory([path]);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-blue-500/5 to-sky-500/5 dark:from-slate-950 dark:via-blue-600/10 dark:to-sky-500/5 text-gray-900 dark:text-gray-100">
      {/* Sidebar navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => {
          if (path === '/study') {
            navigateTo('/study/batches');
          } else {
            navigateTo(path);
          }
        }}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-transparent via-blue-500/3 to-sky-500/3 dark:via-blue-500/5 dark:to-sky-500/5">
        <Navbar
          onBack={handleBack}
          canGoBack={history.length > 1 || currentPath !== '/study/batches'}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 pb-16">
          {/* Batches Catalog (Home) */}
          {(currentPath === '/study/batches' || currentPath === '/study' || currentPath === '/') && (
            <BatchesPage
              onOpenBatch={handleOpenBatch}
              onToast={showToast}
            />
          )}

          {/* Batch Details */}
          {currentPath.startsWith('/study/batches/') && !currentPath.includes('/subjects/') && selectedBatchId && (
            <BatchDetailPage
              batchId={selectedBatchId}
              onSelectSubject={handleSelectSubject}
              onBack={handleBack}
              onToast={showToast}
            />
          )}

          {/* Subject Chapters View */}
          {currentPath.includes('/subjects/') && !currentPath.includes('/subject-topics/') && selectedBatchId && selectedSubjectSlug && (
            <SubjectPage
              batchId={selectedBatchId}
              subjectSlug={selectedSubjectSlug}
              subjectTitle={selectedSubjectTitle}
              onSelectChapter={handleSelectChapter}
              onBack={handleBack}
              onToast={showToast}
            />
          )}

          {/* Chapter Topics / Lectures View */}
          {currentPath.includes('/subject-topics/') && selectedBatchId && selectedSubjectSlug && selectedTopicSlug && (
            <ChapterTopicsPage
              batchId={selectedBatchId}
              subjectSlug={selectedSubjectSlug}
              topicSlug={selectedTopicSlug}
              chapterTitle={selectedChapterTitle}
              onPlayVideo={(topic) => setActiveVideoTopic(topic)}
              onViewNotes={(url, title) => {
                if (url) {
                  window.open(url, '_blank');
                } else {
                  setActiveNote({ url, title });
                }
              }}
              onBack={handleBack}
              onToast={showToast}
            />
          )}

          {/* My Batches */}
          {currentPath === '/study/mybatches' && (
            <MyBatchesPage
              onOpenBatch={handleOpenBatch}
              onExplore={() => navigateTo('/study/batches')}
              onToast={showToast}
            />
          )}

          {/* Donate Page */}
          {currentPath === '/study/donate' && <DonatePage />}

          {/* Contact Us Page */}
          {currentPath === '/contact' && <ContactPage />}
        </main>
      </div>

      {/* Telegram Community Popup Modal */}
      <TelegramModal />

      {/* Video Lecture Player Modal */}
      {activeVideoTopic && (
        <WatchModal
          topic={activeVideoTopic}
          onClose={() => setActiveVideoTopic(null)}
        />
      )}

      {/* Notes PDF Preview Modal fallback */}
      {activeNote && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 border border-blue-500/30 text-center space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {activeNote.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Class notes and study materials are being prepared for offline viewing.
            </p>
            <button
              onClick={() => setActiveNote(null)}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-spring-md text-sm font-semibold transition-all duration-300 ${
              toast.isError
                ? 'bg-red-600 text-white border border-red-700'
                : 'bg-blue-600 text-white border border-blue-700'
            }`}
          >
            {toast.isError ? (
              <X className="w-4 h-4 shrink-0" />
            ) : (
              <Check className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
