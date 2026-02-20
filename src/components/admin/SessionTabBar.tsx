import { Plus, X } from 'lucide-react';
import type { ActiveSession } from './types';

interface SessionTabBarProps {
  sessions: ActiveSession[];
  activeSessionId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNew: () => void;
  maxSessions: number;
}

export function SessionTabBar({
  sessions,
  activeSessionId,
  onSelect,
  onClose,
  onNew,
  maxSessions,
}: SessionTabBarProps) {
  const atMax = sessions.length >= maxSessions;

  return (
    <div className="lg:hidden border-t border-gray-200 bg-white px-2 py-1.5 shrink-0">
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          const truncatedTitle =
            session.title.length > 15 ? session.title.slice(0, 15) + '...' : session.title;

          return (
            <button
              key={session.id}
              onClick={() => onSelect(session.id)}
              className={`
                relative flex items-center gap-1.5 px-3 h-10 rounded-full text-sm font-medium
                whitespace-nowrap shrink-0 transition-colors
                ${isActive
                  ? 'bg-primary-dark text-white'
                  : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                }
              `}
            >
              {session.isStreaming && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              )}
              <span>{truncatedTitle}</span>
              {sessions.length > 1 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(session.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      onClose(session.id);
                    }
                  }}
                  className={`
                    ml-0.5 p-0.5 rounded-full transition-colors
                    ${isActive
                      ? 'hover:bg-white/20'
                      : 'hover:bg-gray-300'
                    }
                  `}
                  aria-label={`Close ${session.title}`}
                >
                  <X className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          );
        })}

        <button
          onClick={onNew}
          disabled={atMax}
          className={`
            flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors
            ${atMax
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : 'bg-gray-100 text-gray-600 active:bg-gray-200'
            }
          `}
          aria-label="New chat tab"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
