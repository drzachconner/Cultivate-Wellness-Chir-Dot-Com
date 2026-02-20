export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  toolActivity?: ToolStatus[];
  createdAt?: string;
}

export interface ToolStatus {
  tool: string;
  toolUseId: string;
  status: 'running' | 'done' | 'error';
  input?: Record<string, unknown>;
}

export interface UsageInfo {
  percentUsed: number;
  isOverBudget: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface ConversationDetail {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

export interface ChangeEntry {
  id: string;
  conversationId?: string;
  action: string;
  filePath?: string;
  summary: string;
  gitCommitHash?: string;
  createdAt: string;
}

export interface ImageAttachment {
  id: string;
  data: string;       // base64-encoded (no data: prefix)
  mediaType: string;  // e.g. 'image/png'
  name: string;
  previewUrl: string; // data URL for rendering preview
}

export interface ActiveSession {
  id: string;
  conversationId: string | null;
  title: string;
  messages: Message[];
  input: string;
  streamingText: string;
  isStreaming: boolean;
  activeTools: ToolStatus[];
  scrollPosition: number;
  hadCommit: boolean;
  createdAt: number;
}

export interface SessionsState {
  sessions: Record<string, ActiveSession>;
  activeSessionId: string;
  order: string[];
}

export type SessionAction =
  | { type: 'ADD_SESSION'; session: ActiveSession }
  | { type: 'REMOVE_SESSION'; sessionId: string }
  | { type: 'SET_ACTIVE'; sessionId: string }
  | { type: 'UPDATE_SESSION'; sessionId: string; updates: Partial<ActiveSession> }
  | { type: 'APPEND_MESSAGE'; sessionId: string; message: Message }
  | { type: 'SET_STREAMING_TEXT'; sessionId: string; text: string }
  | { type: 'SET_IS_STREAMING'; sessionId: string; streaming: boolean }
  | { type: 'SET_TOOLS'; sessionId: string; tools: ToolStatus[] }
  | { type: 'APPEND_TOOL'; sessionId: string; tool: ToolStatus }
  | { type: 'UPDATE_TOOL'; sessionId: string; toolUseId: string; status: ToolStatus['status'] }
  | { type: 'SAVE_SCROLL'; sessionId: string; position: number }
  | { type: 'SET_CONVERSATION_ID'; sessionId: string; conversationId: string };
