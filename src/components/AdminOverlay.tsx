import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Minus, X, Maximize2, Minimize2, Loader2, Plus, Menu, History } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useDraggable } from '../hooks/useDraggable';
import { useDeployPoller } from '../hooks/useDeployPoller';
import type { Message, ToolStatus, UsageInfo, ImageAttachment, Conversation, ChangeEntry } from './admin/types';
import { AGENT_URL, PROJECT_ID, WELCOME_MESSAGE } from './admin/constants';
import { sendChat, fetchUsage, listConversations, getConversation, deleteConversation, listChanges } from './admin/api';
import { parseSSEStream } from './admin/sse-parser';
import { MessageBubble, StreamingBubble } from './admin/MessageBubble';
import { ToolStatusBar } from './admin/ToolStatusBar';
import { ChatInput } from './admin/ChatInput';
import { ConversationSidebar } from './admin/ConversationSidebar';
import { ChangeLogPanel } from './admin/ChangeLogPanel';

const SIZE_PRESETS = {
  compact: { w: 380, h: 500 },
  medium: { w: 480, h: 600 },
  large: { w: 580, h: 700 },
} as const;

const SIZE_ORDER: Array<'compact' | 'medium' | 'large'> = ['compact', 'medium', 'large'];

interface AdminOverlayProps {
  panelId: string;
  panelIndex: number;
}

export default function AdminOverlay({ panelId, panelIndex }: AdminOverlayProps) {
  const {
    panels, isAuthenticated, password,
    authenticate, signOut, addPanel,
    removePanel, minimizePanel, restorePanel, setPanelSize,
  } = useAdmin();

  const panel = panels.find((p) => p.id === panelId);
  const { position, isDragging, onMouseDown } = useDraggable(
    { x: panel?.initialX ?? 20, y: panel?.initialY ?? 80 },
    `admin_drag_${panelId}`,
  );
  const deployPoller = useDeployPoller();

  // Auth input (only used when not authenticated)
  const [authInput, setAuthInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Chat state (per-panel, independent)
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: WELCOME_MESSAGE }]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [activeTools, setActiveTools] = useState<ToolStatus[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Usage
  const [usage, setUsage] = useState<UsageInfo | null>(null);

  // Conversation history & change log
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [changes, setChanges] = useState<ChangeEntry[]>([]);
  const [changeLogOpen, setChangeLogOpen] = useState(false);

  // Panel
  const [isMobile, setIsMobile] = useState(false);

  // Deploy
  const hadCommitRef = useRef(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // --- Mobile detection ---
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // --- Body scroll lock + viewport reset on mobile ---
  useEffect(() => {
    if (panel && !panel.isMinimized && isMobile) {
      const scrollY = window.scrollY;
      const html = document.documentElement;

      // Force viewport zoom to 1x by temporarily locking scale
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      const originalViewport = viewportMeta?.getAttribute('content') ?? '';
      viewportMeta?.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
      );

      // Lock html + body to prevent background page from affecting layout
      html.style.position = 'fixed';
      html.style.inset = '0';
      html.style.overflow = 'hidden';
      html.style.width = '100vw';
      html.style.maxWidth = '100vw';
      document.body.style.position = 'fixed';
      document.body.style.inset = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100vw';
      document.body.style.maxWidth = '100vw';

      return () => {
        // Restore viewport meta
        if (viewportMeta && originalViewport) {
          viewportMeta.setAttribute('content', originalViewport);
        }
        html.style.position = '';
        html.style.inset = '';
        html.style.overflow = '';
        html.style.width = '';
        html.style.maxWidth = '';
        document.body.style.position = '';
        document.body.style.inset = '';
        document.body.style.overflow = '';
        document.body.style.width = '';
        document.body.style.maxWidth = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [panel, isMobile]);

  // --- Load usage on mount when authenticated ---
  useEffect(() => {
    if (isAuthenticated && password) {
      fetchUsage(password).then(setUsage).catch(() => {});
    }
  }, [isAuthenticated, password]);

  // --- Scroll to bottom ---
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

  // --- Load usage ---
  const loadUsage = useCallback(async () => {
    if (!password) return;
    try {
      const data = await fetchUsage(password);
      setUsage(data);
    } catch {
      // Non-critical
    }
  }, [password]);

  // --- Load conversations ---
  const loadConversations = useCallback(async () => {
    if (!password) return;
    try {
      const convs = await listConversations(password);
      setConversations(convs);
    } catch {
      // Non-critical
    }
  }, [password]);

  // --- Load changes ---
  const loadChanges = useCallback(async () => {
    if (!password) return;
    try {
      const ch = await listChanges(password);
      setChanges(ch);
    } catch {
      // Non-critical
    }
  }, [password]);

  // --- Load conversations on mount ---
  useEffect(() => {
    if (isAuthenticated && password) {
      loadConversations();
    }
  }, [isAuthenticated, password, loadConversations]);

  // --- Select a past conversation ---
  const handleSelectConversation = async (convId: string) => {
    if (!password) return;
    try {
      const conv = await getConversation(password, convId);
      if (conv) {
        setMessages(conv.messages.length > 0 ? conv.messages : [{ role: 'assistant', content: WELCOME_MESSAGE }]);
        setConversationId(conv.id);
        setSidebarOpen(false);
      }
    } catch {
      // Handle error
    }
  };

  // --- New conversation ---
  const handleNewConversation = () => {
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
    setConversationId(null);
    setInput('');
    setStreamingText('');
    setActiveTools([]);
    setSidebarOpen(false);
  };

  // --- Delete conversation ---
  const handleDeleteConversation = async (convId: string) => {
    if (!password) return;
    try {
      await deleteConversation(password, convId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      // If we deleted the active conversation, reset to new
      if (conversationId === convId) {
        handleNewConversation();
      }
    } catch {
      // Handle error
    }
  };

  // --- Undo (revert a commit) ---
  const handleUndo = (commitHash: string) => {
    handleSendMessage(`Please revert commit ${commitHash} using git revert, then push the changes.`);
    setChangeLogOpen(false);
  };

  // --- Navigate to conversation from change log ---
  const handleNavigateToConversation = (convId: string) => {
    handleSelectConversation(convId);
    setChangeLogOpen(false);
  };

  // --- Cycle panel size ---
  const cycleSize = () => {
    if (!panel) return;
    const idx = SIZE_ORDER.indexOf(panel.size);
    setPanelSize(panelId, SIZE_ORDER[(idx + 1) % SIZE_ORDER.length]);
  };

  // --- Close panel ---
  const handleClose = () => {
    removePanel(panelId);
  };

  // --- Sign out ---
  const handleSignOut = () => {
    signOut();
  };

  // --- Auth submit ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authInput.trim()) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${AGENT_URL}/api/v1/projects/${PROJECT_ID}/usage`, {
        headers: { Authorization: `Bearer ${authInput.trim()}` },
      });
      if (!res.ok) throw new Error('Invalid password');
      const data: UsageInfo = await res.json();
      authenticate(authInput.trim());
      setUsage(data);
      setAuthInput('');
    } catch {
      setAuthError('Invalid password');
    } finally {
      setAuthLoading(false);
    }
  };

  // --- Cancel streaming ---
  const handleCancel = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  // --- Send message ---
  const handleSendMessage = async (text: string, images?: ImageAttachment[]) => {
    if ((!text.trim() && (!images || images.length === 0)) || isStreaming || !password) return;

    const userMessage: Message = { role: 'user', content: text.trim(), createdAt: new Date().toISOString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);
    setStreamingText('');
    setActiveTools([]);
    hadCommitRef.current = false;

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const apiMessages = updatedMessages
        .filter((m, idx) => !(idx === 0 && m.role === 'assistant' && m.content === WELCOME_MESSAGE))
        .map((m) => ({ role: m.role, content: m.content }));

      const apiImages = images?.map((img) => ({ data: img.data, mediaType: img.mediaType, name: img.name }));
      const res = await sendChat(password, apiMessages, conversationId || undefined, abortController.signal, apiImages);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const reader = res.body!.getReader();
      let accumulatedText = '';

      await parseSSEStream(reader, {
        onTextDelta: (delta) => {
          accumulatedText += delta;
          setStreamingText(accumulatedText);
        },
        onToolStart: (tool, id, toolInput) => {
          setActiveTools((prev) => [...prev, { tool, toolUseId: id, status: 'running', input: toolInput }]);
        },
        onToolResult: (tool, id, _output, isError) => {
          if (tool === 'git_commit_and_push' && !isError) {
            hadCommitRef.current = true;
          }
          setActiveTools((prev) =>
            prev.map((t) => (t.toolUseId === id ? { ...t, status: isError ? 'error' : 'done' } : t)),
          );
        },
        onDone: (data) => {
          if (accumulatedText) {
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: accumulatedText, createdAt: new Date().toISOString() },
            ]);
          }
          setStreamingText('');

          if (data.conversationId) {
            setConversationId(data.conversationId);
          }

          if (hadCommitRef.current) {
            deployPoller.startPolling();
          }

          loadUsage();
          loadConversations();
          loadChanges();
        },
        onError: (message) => {
          const content = accumulatedText
            ? accumulatedText + `\n\n**Error:** ${message}`
            : `**Error:** ${message}`;
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content, createdAt: new Date().toISOString() },
          ]);
          setStreamingText('');
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `**Error:** ${err.message}`, createdAt: new Date().toISOString() },
        ]);
        setStreamingText('');
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  // If panel was removed from context, don't render
  if (!panel) return null;

  // --- Computed values ---
  const panelNumber = panelIndex + 1;
  const panelLabel = panels.length > 1 ? `Admin #${panelNumber}` : 'Admin Panel';
  const percentUsed = usage?.percentUsed ?? 0;
  const usageColor = percentUsed > 85 ? 'bg-red-400' : percentUsed > 60 ? 'bg-amber-400' : 'bg-primary-light';
  const dims = SIZE_PRESETS[panel.size];

  // --- Minimized state ---
  if (panel.isMinimized) {
    return createPortal(
      <button
        onClick={() => restorePanel(panelId)}
        className="fixed z-[9999] w-12 h-12 rounded-full bg-primary-dark text-white shadow-lg hover:bg-primary-accent transition-colors flex items-center justify-center"
        style={{ bottom: `${16 + panelIndex * 56}px`, left: 16 }}
        aria-label={`Restore ${panelLabel}`}
      >
        {panels.length > 1 ? (
          <span className="text-sm font-bold">{panelNumber}</span>
        ) : (
          <Shield className="w-5 h-5" />
        )}
      </button>,
      document.body,
    );
  }

  // --- Password gate (inline) ---
  const passwordGate = (
    <div className="flex-1 flex items-center justify-center p-6">
      <form onSubmit={handleAuth} className="w-full max-w-[260px] space-y-3">
        <div className="flex justify-center">
          <Shield className="w-8 h-8 text-primary-dark" />
        </div>
        <p className="text-center text-sm text-gray-600">Enter admin password</p>
        <input
          type="password"
          value={authInput}
          onChange={(e) => setAuthInput(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          autoFocus
        />
        {authError && <p className="text-red-500 text-xs text-center">{authError}</p>}
        <button
          type="submit"
          disabled={authLoading || !authInput.trim()}
          className="w-full py-2 bg-primary-dark text-white rounded-lg text-sm font-medium hover:bg-primary-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Enter
        </button>
      </form>
    </div>
  );

  // --- Chat content ---
  const chatContent = (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Deploy status banners */}
      {deployPoller.status === 'polling' && (
        <div className="bg-green-50 border-b border-green-200 px-3 py-1 text-center">
          <span className="text-green-700 text-[11px] font-medium">Site updating... changes will be live soon</span>
        </div>
      )}
      {deployPoller.status === 'deployed' && (
        <div className="bg-blue-50 border-b border-blue-200 px-3 py-1 text-center">
          <span className="text-blue-700 text-[11px] font-medium">
            Site updated! Refreshing in {deployPoller.countdown}s...
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map((message, index) => (
          <MessageBubble key={message.id || index} message={message} />
        ))}
        {streamingText && <StreamingBubble content={streamingText} />}
        {isStreaming && activeTools.length > 0 && (
          <div className="flex justify-start">
            <div className="max-w-[90%]">
              <ToolStatusBar tools={activeTools} />
            </div>
          </div>
        )}
        {isStreaming && !streamingText && activeTools.length === 0 && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl rounded-bl-md px-3 py-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSendMessage}
        onCancel={handleCancel}
        isStreaming={isStreaming}
      />
    </div>
  );

  // --- Header bar (shared) ---
  const headerBar = (
    <div
      onMouseDown={isMobile ? undefined : onMouseDown}
      className={`bg-primary-dark text-white px-3 py-2 flex items-center gap-2 shrink-0 ${
        isMobile ? 'pt-[max(0.5rem,env(safe-area-inset-top))]' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* Conversations sidebar toggle (mobile) */}
      {isMobile && isAuthenticated && (
        <button
          onClick={() => { loadConversations(); setSidebarOpen(true); }}
          className="w-7 h-7 rounded-md hover:bg-white/20 flex items-center justify-center"
          aria-label="Conversations"
        >
          <Menu className="w-4 h-4" />
        </button>
      )}

      <Shield className="w-4 h-4 shrink-0" />
      <span className="font-heading font-bold text-sm flex-1 min-w-0 truncate select-none">{panelLabel}</span>

      {/* Usage mini-bar */}
      {usage && (
        <div className="flex-shrink-0 w-[100px]">
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${usageColor}`} style={{ width: `${percentUsed}%` }} />
          </div>
        </div>
      )}

      {/* Change log / undo button */}
      {isAuthenticated && (
        <button
          onClick={() => { loadChanges(); setChangeLogOpen(true); }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-7 h-7 rounded-md hover:bg-white/20 flex items-center justify-center"
          aria-label="Recent changes"
        >
          <History className="w-3.5 h-3.5 opacity-80" />
        </button>
      )}

      {/* Sign out (when authenticated) */}
      {isAuthenticated && (
        <button
          onClick={handleSignOut}
          onMouseDown={(e) => e.stopPropagation()}
          className="text-[10px] opacity-70 hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          Sign out
        </button>
      )}

      {/* Size cycle button (desktop only) */}
      {!isMobile && (
        <button
          onClick={cycleSize}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-7 h-7 rounded-md hover:bg-white/20 flex items-center justify-center"
          aria-label="Toggle size"
        >
          {panel.size === 'large' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* New panel button */}
      <button
        onClick={() => addPanel()}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-7 h-7 rounded-md hover:bg-white/20 flex items-center justify-center"
        aria-label="New panel"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => minimizePanel(panelId)}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-7 h-7 rounded-md hover:bg-white/20 flex items-center justify-center"
        aria-label="Minimize"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={handleClose}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-7 h-7 rounded-md hover:bg-white/20 flex items-center justify-center"
        aria-label="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  // --- Mobile: fullscreen ---
  if (isMobile) {
    return createPortal(
      <div
        className="fixed top-0 left-0 z-[9999] flex flex-col bg-white overflow-hidden"
        style={{ width: '100%', height: '100dvh' }}
      >
        {headerBar}
        {isAuthenticated ? chatContent : passwordGate}

        {/* Conversation sidebar (slides in from left) */}
        {isAuthenticated && (
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={conversationId}
            onSelect={handleSelectConversation}
            onNew={handleNewConversation}
            onDelete={handleDeleteConversation}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Change log / undo panel (slides in from right) */}
        {isAuthenticated && (
          <ChangeLogPanel
            changes={changes}
            isOpen={changeLogOpen}
            onClose={() => setChangeLogOpen(false)}
            onUndo={handleUndo}
            onNavigateToConversation={handleNavigateToConversation}
          />
        )}
      </div>,
      document.body,
    );
  }

  // --- Desktop: draggable panel ---
  return createPortal(
    <>
      <div
        className="fixed z-[9999] flex flex-col bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        style={{
          left: position.x,
          top: position.y,
          width: dims.w,
          height: dims.h,
          userSelect: isDragging ? 'none' : undefined,
        }}
      >
        {headerBar}
        {isAuthenticated ? chatContent : passwordGate}
      </div>

      {/* Change log panel (desktop — renders outside the panel for proper overlay) */}
      {isAuthenticated && (
        <ChangeLogPanel
          changes={changes}
          isOpen={changeLogOpen}
          onClose={() => setChangeLogOpen(false)}
          onUndo={handleUndo}
          onNavigateToConversation={handleNavigateToConversation}
        />
      )}
    </>,
    document.body,
  );
}
