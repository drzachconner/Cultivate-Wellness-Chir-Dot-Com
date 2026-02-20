import { useState, useEffect } from 'react';
import { X, FileText, GitCommit, RotateCcw } from 'lucide-react';
import type { ChangeEntry } from './types';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function actionIcon(action: string) {
  switch (action) {
    case 'edit_file':
    case 'write_file':
      return FileText;
    case 'git_commit_and_push':
      return GitCommit;
    default:
      return FileText;
  }
}

interface ChangeLogPanelProps {
  changes: ChangeEntry[];
  isOpen: boolean;
  onClose: () => void;
  onUndo: (commitHash: string, summary: string) => void;
  onNavigateToConversation: (conversationId: string) => void;
}

export function ChangeLogPanel({
  changes,
  isOpen,
  onClose,
  onUndo,
  onNavigateToConversation,
}: ChangeLogPanelProps) {
  const [confirmUndo, setConfirmUndo] = useState<string | null>(null);

  // Lock body scroll when panel is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  // Find the most recent git commit entry for undo
  const latestCommit = changes.find((c) => c.gitCommitHash);

  const handleUndo = (hash: string, summary: string) => {
    if (confirmUndo === hash) {
      onUndo(hash, summary);
      setConfirmUndo(null);
    } else {
      setConfirmUndo(hash);
      setTimeout(() => setConfirmUndo(null), 5000);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      )}

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[calc(100vw-1rem)] max-w-[380px] bg-white shadow-xl flex flex-col transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-heading font-semibold text-primary-dark">Recent Changes</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {changes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center mt-8">No changes recorded yet.</p>
          ) : (
            changes.map((change) => {
              const Icon = actionIcon(change.action);
              const isLatestCommit = latestCommit?.id === change.id && change.gitCommitHash;

              return (
                <div
                  key={change.id}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">{change.summary}</p>
                    {change.filePath && (
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{change.filePath}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400">{formatDate(change.createdAt)}</span>
                      {change.conversationId && (
                        <button
                          onClick={() => onNavigateToConversation(change.conversationId!)}
                          className="text-[10px] text-primary hover:underline"
                        >
                          View chat
                        </button>
                      )}
                      {change.gitCommitHash && (
                        <span className="text-[10px] text-gray-300 font-mono">
                          {change.gitCommitHash.substring(0, 7)}
                        </span>
                      )}
                    </div>
                  </div>
                  {isLatestCommit && (
                    <button
                      onClick={() => handleUndo(change.gitCommitHash!, change.summary)}
                      className={`rounded-lg transition-colors shrink-0 ${
                        confirmUndo === change.gitCommitHash
                          ? 'bg-red-100 text-red-600 px-2 py-1 text-xs font-medium'
                          : 'p-1.5 hover:bg-gray-200 text-gray-400'
                      }`}
                      title={confirmUndo === change.gitCommitHash ? 'Click to confirm undo' : 'Undo this change'}
                    >
                      {confirmUndo === change.gitCommitHash ? (
                        'Confirm?'
                      ) : (
                        <RotateCcw className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
