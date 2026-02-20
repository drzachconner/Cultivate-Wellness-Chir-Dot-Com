import { useReducer, useRef, useCallback } from 'react';
import type { ActiveSession, SessionsState, SessionAction, Message } from './types';
import { WELCOME_MESSAGE } from './constants';

export const MAX_SESSIONS = 4;

function createNewSession(): ActiveSession {
  return {
    id: crypto.randomUUID(),
    conversationId: null,
    title: 'New Chat',
    messages: [{ role: 'assistant' as const, content: WELCOME_MESSAGE }],
    input: '',
    streamingText: '',
    isStreaming: false,
    activeTools: [],
    scrollPosition: 0,
    hadCommit: false,
    createdAt: Date.now(),
  };
}

function sessionsReducer(state: SessionsState, action: SessionAction): SessionsState {
  switch (action.type) {
    case 'ADD_SESSION': {
      if (state.order.length >= MAX_SESSIONS) return state;
      return {
        ...state,
        sessions: { ...state.sessions, [action.session.id]: action.session },
        order: [...state.order, action.session.id],
        activeSessionId: action.session.id,
      };
    }
    case 'REMOVE_SESSION': {
      const { [action.sessionId]: _, ...remaining } = state.sessions;
      const newOrder = state.order.filter((id) => id !== action.sessionId);
      let newActiveId = state.activeSessionId;
      if (state.activeSessionId === action.sessionId) {
        const removedIndex = state.order.indexOf(action.sessionId);
        newActiveId = newOrder[Math.min(removedIndex, newOrder.length - 1)] ?? '';
      }
      // If no sessions remain, create a fresh one
      if (newOrder.length === 0) {
        const fresh = createNewSession();
        return {
          sessions: { [fresh.id]: fresh },
          order: [fresh.id],
          activeSessionId: fresh.id,
        };
      }
      return { sessions: remaining, order: newOrder, activeSessionId: newActiveId };
    }
    case 'SET_ACTIVE': {
      if (!state.sessions[action.sessionId]) return state;
      return { ...state, activeSessionId: action.sessionId };
    }
    case 'UPDATE_SESSION': {
      const session = state.sessions[action.sessionId];
      if (!session) return state;
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.sessionId]: { ...session, ...action.updates },
        },
      };
    }
    case 'APPEND_MESSAGE': {
      const session = state.sessions[action.sessionId];
      if (!session) return state;
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.sessionId]: {
            ...session,
            messages: [...session.messages, action.message],
          },
        },
      };
    }
    case 'SET_STREAMING_TEXT': {
      const session = state.sessions[action.sessionId];
      if (!session) return state;
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.sessionId]: { ...session, streamingText: action.text },
        },
      };
    }
    case 'SET_IS_STREAMING': {
      const session = state.sessions[action.sessionId];
      if (!session) return state;
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.sessionId]: { ...session, isStreaming: action.streaming },
        },
      };
    }
    case 'SET_TOOLS': {
      const session = state.sessions[action.sessionId];
      if (!session) return state;
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.sessionId]: { ...session, activeTools: action.tools },
        },
      };
    }
    case 'APPEND_TOOL': {
      const session = state.sessions[action.sessionId];
      if (!session) return state;
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.sessionId]: {
            ...session,
            activeTools: [...session.activeTools, action.tool],
          },
        },
      };
    }
    case 'UPDATE_TOOL': {
      const session = state.sessions[action.sessionId];
      if (!session) return state;
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.sessionId]: {
            ...session,
            activeTools: session.activeTools.map((t) =>
              t.toolUseId === action.toolUseId ? { ...t, status: action.status } : t,
            ),
          },
        },
      };
    }
    case 'SAVE_SCROLL': {
      const session = state.sessions[action.sessionId];
      if (!session) return state;
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.sessionId]: { ...session, scrollPosition: action.position },
        },
      };
    }
    case 'SET_CONVERSATION_ID': {
      const session = state.sessions[action.sessionId];
      if (!session) return state;
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.sessionId]: { ...session, conversationId: action.conversationId },
        },
      };
    }
    default:
      return state;
  }
}

function createInitialState(): SessionsState {
  const session = createNewSession();
  return {
    sessions: { [session.id]: session },
    order: [session.id],
    activeSessionId: session.id,
  };
}

export function useSessionManager() {
  const [state, dispatch] = useReducer(sessionsReducer, null, createInitialState);
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const activeSession = state.sessions[state.activeSessionId] ?? null;

  const createSession = useCallback(() => {
    if (state.order.length >= MAX_SESSIONS) return null;
    const session = createNewSession();
    dispatch({ type: 'ADD_SESSION', session });
    return session.id;
  }, [state.order.length]);

  const closeSession = useCallback((sessionId: string) => {
    const controller = abortControllers.current.get(sessionId);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(sessionId);
    }
    dispatch({ type: 'REMOVE_SESSION', sessionId });
  }, []);

  const switchSession = useCallback((sessionId: string) => {
    dispatch({ type: 'SET_ACTIVE', sessionId });
  }, []);

  const findSessionByConversationId = useCallback(
    (conversationId: string): string | null => {
      for (const id of state.order) {
        if (state.sessions[id]?.conversationId === conversationId) return id;
      }
      return null;
    },
    [state.order, state.sessions],
  );

  const openConversationInTab = useCallback(
    (conversationId: string, messages: Message[], title: string) => {
      // Already open? Switch to it.
      const existing = findSessionByConversationId(conversationId);
      if (existing) {
        dispatch({ type: 'SET_ACTIVE', sessionId: existing });
        return;
      }

      // Room for a new tab?
      if (state.order.length < MAX_SESSIONS) {
        const session: ActiveSession = {
          ...createNewSession(),
          conversationId,
          title,
          messages: messages.length > 0 ? messages : [{ role: 'assistant', content: WELCOME_MESSAGE }],
        };
        dispatch({ type: 'ADD_SESSION', session });
        return;
      }

      // At max — replace current tab
      const currentId = state.activeSessionId;
      const controller = abortControllers.current.get(currentId);
      if (controller) {
        controller.abort();
        abortControllers.current.delete(currentId);
      }
      dispatch({
        type: 'UPDATE_SESSION',
        sessionId: currentId,
        updates: {
          conversationId,
          title,
          messages: messages.length > 0 ? messages : [{ role: 'assistant', content: WELCOME_MESSAGE }],
          streamingText: '',
          isStreaming: false,
          activeTools: [],
          input: '',
          hadCommit: false,
          scrollPosition: 0,
        },
      });
    },
    [state.order.length, state.activeSessionId, findSessionByConversationId],
  );

  return {
    state,
    activeSession,
    dispatch,
    abortControllers,
    createSession,
    closeSession,
    switchSession,
    findSessionByConversationId,
    openConversationInTab,
  };
}
