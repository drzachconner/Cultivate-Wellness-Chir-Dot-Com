import { useState, useEffect } from 'react';
import { Plus, Trash2, MessageSquare, X } from 'lucide-react';
import type { Conversation } from './types';

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelect,
  onNew,
  onDelete,
  isOpen,
  onClose,
}: ConversationSidebarProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[calc(100vw-1rem)] max-w-[280px] bg-white border-r border-gray-200 shadow-xl flex flex-col transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h2 className="font-heading font-semibold text-sm text-primary-dark">Conversations</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={onNew}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-primary-dark transition-colors"
              title="New conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-xs text-gray-400 text-center mt-8 px-4">No conversations yet. Start chatting!</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => { onSelect(conv.id); onClose(); }}
                className={`group flex items-start gap-2 px-3 py-2.5 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  conv.id === activeConversationId ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
              >
                <MessageSquare className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">{conv.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {timeAgo(conv.updatedAt)} · {conv.messageCount} msg{conv.messageCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(conv.id); }}
                  className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                    confirmDelete === conv.id
                      ? 'bg-red-100 text-red-600 opacity-100'
                      : 'hover:bg-gray-200 text-gray-400'
                  }`}
                  title={confirmDelete === conv.id ? 'Click again to confirm' : 'Delete'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
