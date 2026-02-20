import { useState, useRef, useEffect, useCallback } from 'react';
import { LogOut, Menu, History } from 'lucide-react';
import type { Conversation, ChangeEntry, ImageAttachment } from './types';
import { WELCOME_MESSAGE, DEPLOY_COUNTDOWN_SECONDS } from './constants';
import { listConversations, getConversation, deleteConversation, listChanges, sendChat, checkBackendHealth, isRetryableError, sleep, MAX_RETRIES, RETRY_DELAY_MS } from './api';
import { parseSSEStream } from './sse-parser';
import { MessageBubble, StreamingBubble } from './MessageBubble';
import { ToolStatusBar } from './ToolStatusBar';
import { ChatInput } from './ChatInput';
import { QuickActions } from './QuickActions';
import { SITE } from '../../data/site';
import { ConversationSidebar } from './ConversationSidebar';
import { ChangeLogPanel } from './ChangeLogPanel';
import { SessionTabBar } from './SessionTabBar';
import { useSessionManager, MAX_SESSIONS } from './useSessionManager';

interface ChatInterfaceProps {
  password: string;
  onSignOut: () => void;
}

export function ChatInterface({ password, onSignOut }: ChatInterfaceProps) {
  // Multi-session state
  const {
    state: sessionsState,
    activeSession,
    dispatch,
    abortControllers,
    createSession,
    closeSession,
    switchSession,
    openConversationInTab,
  } = useSessionManager();

  // Conversation list state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Change log state
  const [changes, setChanges] = useState<ChangeEntry[]>([]);
  const [changeLogOpen, setChangeLogOpen] = useState(false);

  // Backend status
  const [backendOnline, setBackendOnline] = useState(true);

  // Deploy countdown (shared across all sessions)
  const [deployCountdown, setDeployCountdown] = useState<number | null>(null);

  // Refs
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousSessionIdRef = useRef<string>(sessionsState.activeSessionId);

  // Derive current values from active session
  const messages = activeSession?.messages ?? [];
  const input = activeSession?.input ?? '';
  const isStreaming = activeSession?.isStreaming ?? false;
  const streamingText = activeSession?.streamingText ?? '';
  const activeTools = activeSession?.activeTools ?? [];
  const conversationId = activeSession?.conversationId ?? null;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

  // Save/restore scroll position on session switch
  useEffect(() => {
    const prevId = previousSessionIdRef.current;
    const newId = sessionsState.activeSessionId;

    if (prevId !== newId) {
      // Save scroll position of previous session
      if (messagesContainerRef.current) {
        dispatch({
          type: 'SAVE_SCROLL',
          sessionId: prevId,
          position: messagesContainerRef.current.scrollTop,
        });
      }

      // Restore scroll position of new session
      requestAnimationFrame(() => {
        if (messagesContainerRef.current && activeSession) {
          messagesContainerRef.current.scrollTop = activeSession.scrollPosition;
        }
      });

      previousSessionIdRef.current = newId;
    }
  }, [sessionsState.activeSessionId, activeSession, dispatch]);

  // Fetch initial data
  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep-alive: detect when user returns to tab and refresh connection state
  useEffect(() => {
    let lastHiddenTime: number | null = null;
    const RECONNECT_THRESHOLD_MS = 30000; // 30 seconds

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is being hidden - record the time
        lastHiddenTime = Date.now();
      } else {
        // Tab is visible again
        const hiddenDuration = lastHiddenTime ? Date.now() - lastHiddenTime : 0;

        // If we were hidden for more than threshold, refresh data
        if (hiddenDuration > RECONNECT_THRESHOLD_MS) {
          loadConversations();
        }

        lastHiddenTime = null;
      }
    };

    // Also handle page focus (catches some mobile edge cases)
    const handleFocus = () => {
      if (lastHiddenTime) {
        const hiddenDuration = Date.now() - lastHiddenTime;
        if (hiddenDuration > RECONNECT_THRESHOLD_MS) {
          loadConversations();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Backend health check (every 30 seconds)
  useEffect(() => {
    const check = async () => {
      const online = await checkBackendHealth();
      setBackendOnline(online);
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  // Deploy countdown timer
  useEffect(() => {
    if (deployCountdown === null) return;
    if (deployCountdown <= 0) {
      const timeout = setTimeout(() => setDeployCountdown(null), 10000);
      return () => clearTimeout(timeout);
    }
    const interval = setInterval(() => {
      setDeployCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [deployCountdown]);

  const loadConversations = async () => {
    try {
      const convs = await listConversations(password);
      setConversations(convs);
    } catch {
      // Non-critical
    }
  };

  const loadChanges = async () => {
    try {
      const ch = await listChanges(password);
      setChanges(ch);
    } catch {
      // Non-critical
    }
  };

  const handleSelectConversation = async (convId: string) => {
    try {
      const conv = await getConversation(password, convId);
      if (conv) {
        openConversationInTab(conv.id, conv.messages, conv.title);
      }
    } catch {
      // Handle error
    }
  };

  const handleNewConversation = () => {
    createSession();
  };

  const handleDeleteConversation = async (convId: string) => {
    try {
      await deleteConversation(password, convId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      // If this conversation is open in a tab, close that tab
      for (const id of sessionsState.order) {
        if (sessionsState.sessions[id]?.conversationId === convId) {
          closeSession(id);
          break;
        }
      }
    } catch {
      // Handle error
    }
  };

  const setInput = (value: string) => {
    if (!activeSession) return;
    dispatch({ type: 'UPDATE_SESSION', sessionId: activeSession.id, updates: { input: value } });
  };

  const handleSendMessage = async (text: string, images?: ImageAttachment[]) => {
    if (!activeSession) return;
    if ((!text.trim() && (!images || images.length === 0)) || activeSession.isStreaming) return;

    // Capture session ID at call start so SSE callbacks target the right session
    const sessionId = activeSession.id;
    const currentConversationId = activeSession.conversationId;

    const userMessage = { role: 'user' as const, content: text.trim(), createdAt: new Date().toISOString() };
    dispatch({ type: 'APPEND_MESSAGE', sessionId, message: userMessage });
    dispatch({ type: 'UPDATE_SESSION', sessionId, updates: { input: '' } });
    dispatch({ type: 'SET_IS_STREAMING', sessionId, streaming: true });
    dispatch({ type: 'SET_STREAMING_TEXT', sessionId, text: '' });
    dispatch({ type: 'SET_TOOLS', sessionId, tools: [] });

    // Local mutable flag — avoids stale closure when reading reducer state in onDone
    let hadCommitLocal = false;

    // Update tab title from first user message
    if (activeSession.title === 'New Chat') {
      const title = text.trim().slice(0, 25) + (text.trim().length > 25 ? '...' : '');
      dispatch({ type: 'UPDATE_SESSION', sessionId, updates: { title } });
    }

    const abortController = new AbortController();
    abortControllers.current.set(sessionId, abortController);

    // Build messages for API (current session messages + new user message)
    const allMessages = [...activeSession.messages, userMessage];

    // Helper function to attempt the chat request with retries
    const attemptChat = async (retryCount = 0): Promise<void> => {
      try {
        const apiMessages = allMessages
          .filter((m, idx) => !(idx === 0 && m.role === 'assistant' && m.content === WELCOME_MESSAGE))
          .map((m) => ({ role: m.role, content: m.content }));

        const apiImages = images?.map((img) => ({ data: img.data, mediaType: img.mediaType, name: img.name }));
        const res = await sendChat(password, apiMessages, currentConversationId || undefined, abortController.signal, apiImages);

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Request failed' }));
          throw new Error(err.error || `HTTP ${res.status}`);
        }

        const reader = res.body!.getReader();
        let accumulatedText = '';

        await parseSSEStream(reader, {
          onTextDelta: (delta) => {
            accumulatedText += delta;
            dispatch({ type: 'SET_STREAMING_TEXT', sessionId, text: accumulatedText });
          },
          onToolStart: (tool, id, toolInput) => {
            dispatch({
              type: 'APPEND_TOOL',
              sessionId,
              tool: { tool, toolUseId: id, status: 'running', input: toolInput },
            });
          },
          onToolResult: (tool, id, _output, isError) => {
            if (tool === 'git_commit_and_push' && !isError) {
              hadCommitLocal = true;
            }
            dispatch({ type: 'UPDATE_TOOL', sessionId, toolUseId: id, status: isError ? 'error' : 'done' });
          },
          onDone: (data) => {
            if (accumulatedText) {
              dispatch({
                type: 'APPEND_MESSAGE',
                sessionId,
                message: { role: 'assistant', content: accumulatedText, createdAt: new Date().toISOString() },
              });
            }
            dispatch({ type: 'SET_STREAMING_TEXT', sessionId, text: '' });

            if (data.conversationId) {
              dispatch({ type: 'SET_CONVERSATION_ID', sessionId, conversationId: data.conversationId });
            }

            if (hadCommitLocal) {
              setDeployCountdown(DEPLOY_COUNTDOWN_SECONDS);
            }

            loadConversations();
            loadChanges();
          },
          onError: (message) => {
            // Check if this is a retryable error
            const error = new Error(message);
            if (isRetryableError(error) && retryCount < MAX_RETRIES) {
              throw error; // Will be caught and retried
            }
            const content = accumulatedText
              ? accumulatedText + `\n\n**Error:** ${message}`
              : `**Error:** ${message}`;
            dispatch({
              type: 'APPEND_MESSAGE',
              sessionId,
              message: { role: 'assistant', content, createdAt: new Date().toISOString() },
            });
            dispatch({ type: 'SET_STREAMING_TEXT', sessionId, text: '' });
          },
        });
      } catch (err: unknown) {
        // Don't retry if explicitly aborted
        if (err instanceof Error && err.name === 'AbortError') {
          throw err;
        }

        // Retry if it's a network/load error and we haven't exhausted retries
        if (isRetryableError(err) && retryCount < MAX_RETRIES) {
          // Show retry indicator
          dispatch({
            type: 'SET_STREAMING_TEXT',
            sessionId,
            text: `_Connection lost. Retrying (${retryCount + 1}/${MAX_RETRIES})..._`
          });

          // Wait with exponential backoff
          await sleep(RETRY_DELAY_MS * Math.pow(2, retryCount));

          // Retry
          return attemptChat(retryCount + 1);
        }

        // Not retryable or exhausted retries - throw to be handled below
        throw err;
      }
    };

    try {
      await attemptChat();
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        dispatch({
          type: 'APPEND_MESSAGE',
          sessionId,
          message: { role: 'assistant', content: `**Error:** ${err.message}`, createdAt: new Date().toISOString() },
        });
        dispatch({ type: 'SET_STREAMING_TEXT', sessionId, text: '' });
      }
    } finally {
      dispatch({ type: 'SET_IS_STREAMING', sessionId, streaming: false });
      abortControllers.current.delete(sessionId);
    }
  };

  const handleCancel = () => {
    if (!activeSession) return;
    const controller = abortControllers.current.get(activeSession.id);
    controller?.abort();
    dispatch({ type: 'SET_IS_STREAMING', sessionId: activeSession.id, streaming: false });
  };

  const handleUndo = (commitHash: string) => {
    handleSendMessage(`Please revert commit ${commitHash} using git revert, then push the changes.`);
    setChangeLogOpen(false);
  };

  const handleNavigateToConversation = (convId: string) => {
    handleSelectConversation(convId);
    setChangeLogOpen(false);
  };

  const handleSwitchSession = (sessionId: string) => {
    switchSession(sessionId);
  };

  const handleCloseSession = (sessionId: string) => {
    closeSession(sessionId);
  };

  const handleNewSession = () => {
    createSession();
  };

  // Show quick actions only on new conversations with just welcome message
  const showQuickActions = messages.length === 1 && messages[0].role === 'assistant' && !conversationId;

  // Build ordered session list for tab bar
  const orderedSessions = sessionsState.order
    .map((id) => sessionsState.sessions[id])
    .filter(Boolean);

  return (
    <div className="h-[100dvh] w-screen flex bg-gray-50 overflow-hidden pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      {/* Conversation Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={conversationId}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-primary-dark text-white px-3 sm:px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 lg:hidden transition-colors"
            aria-label="Open conversations"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="font-heading font-bold text-lg whitespace-nowrap hidden sm:block">Admin Panel</h1>

          <div className="flex-1" />

          <button
            onClick={() => { loadChanges(); setChangeLogOpen(true); }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Recent changes"
            title="Recent changes"
          >
            <History className="w-5 h-5 opacity-80" />
          </button>

          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 text-sm opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

        {/* Backend status banner */}
        {!backendOnline && (
          <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-medium">
            Cannot reach backend — the server may be down or restarting
          </div>
        )}

        {/* Deploy countdown */}
        {deployCountdown !== null && (
          <div className="bg-green-50 border-b border-green-200 px-4 py-1.5 text-center">
            <span className="text-green-700 text-xs font-medium">
              {deployCountdown > 0
                ? `Deploying... site will update in ~${deployCountdown}s`
                : 'Site updated! Changes are live.'}
            </span>
            {deployCountdown <= 0 && (
              <a
                href={`https://${SITE.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 text-xs ml-2 underline"
              >
                View site
              </a>
            )}
          </div>
        )}

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 min-h-0">
          {messages.map((message, index) => (
            <div key={message.id || index}>
              <MessageBubble message={message} />
              {/* Show tool status after assistant messages during streaming */}
              {message.role === 'assistant' && index === messages.length - 1 && activeTools.length > 0 && !isStreaming && (
                <div className="flex justify-start mt-1">
                  <div className="max-w-[92%] sm:max-w-[85%]">
                    <ToolStatusBar tools={activeTools} autoCollapse />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Streaming response */}
          {streamingText && <StreamingBubble content={streamingText} />}

          {/* Active tool status during streaming */}
          {isStreaming && activeTools.length > 0 && (
            <div className="flex justify-start">
              <div className="max-w-[92%] sm:max-w-[85%]">
                <ToolStatusBar tools={activeTools} />
              </div>
            </div>
          )}

          {/* Loading dots */}
          {isStreaming && !streamingText && activeTools.length === 0 && (
            <div className="flex justify-start">
              <div className="bg-white shadow-sm border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <QuickActions onAction={handleSendMessage} visible={showQuickActions} />

        {/* Session Tab Bar (mobile only) */}
        <SessionTabBar
          sessions={orderedSessions}
          activeSessionId={sessionsState.activeSessionId}
          onSelect={handleSwitchSession}
          onClose={handleCloseSession}
          onNew={handleNewSession}
          maxSessions={MAX_SESSIONS}
        />

        {/* Input */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSendMessage}
          onCancel={handleCancel}
          isStreaming={isStreaming}
        />
      </div>

      {/* Change Log Panel */}
      <ChangeLogPanel
        changes={changes}
        isOpen={changeLogOpen}
        onClose={() => setChangeLogOpen(false)}
        onUndo={handleUndo}
        onNavigateToConversation={handleNavigateToConversation}
      />
    </div>
  );
}
