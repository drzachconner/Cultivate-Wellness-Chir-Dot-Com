import { AGENT_URL, PROJECT_ID } from './constants';
import type { Conversation, ConversationDetail, UsageInfo, ChangeEntry } from './types';

function headers(password: string): HeadersInit {
  return { Authorization: `Bearer ${password}`, 'Content-Type': 'application/json' };
}

const base = `${AGENT_URL}/api/v1/projects/${PROJECT_ID}`;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Timeout configuration
const DEFAULT_TIMEOUT_MS = 30000;     // 30s for normal API calls
const CHAT_TIMEOUT_MS = 300000;       // 5 min for agent chat (SSE)

// Check if error is retryable (network failures, timeouts, "Load failed")
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes('load failed') ||
      msg.includes('network') ||
      msg.includes('fetch') ||
      msg.includes('timeout') ||
      msg.includes('aborted') ||
      msg.includes('failed to fetch') ||
      error.name === 'TypeError' // Usually network errors
    );
  }
  return false;
}

// Sleep helper for retry delays
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 401 handler: clear stored password and redirect to login
function handle401(): never {
  sessionStorage.removeItem('admin_auth');
  window.location.reload();
  // Never returns, but TypeScript needs this
  throw new Error('Session expired');
}

// Wrapper with automatic retry for GET requests
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(url, {
        ...options,
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 globally
      if (res.status === 401) {
        handle401();
      }

      return res;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry if explicitly aborted by caller
      if (lastError.name === 'AbortError' && options.signal?.aborted) {
        throw lastError;
      }

      // Don't retry if we've exhausted attempts or error isn't retryable
      if (attempt >= retries || !isRetryableError(error)) {
        throw lastError;
      }

      // Wait before retrying (exponential backoff)
      await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
    }
  }

  throw lastError || new Error('Request failed');
}

export async function fetchUsage(password: string): Promise<UsageInfo> {
  const res = await fetchWithRetry(`${base}/usage`, { headers: headers(password) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function listConversations(password: string): Promise<Conversation[]> {
  const res = await fetchWithRetry(`${base}/conversations`, { headers: headers(password) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.conversations;
}

export async function getConversation(password: string, convId: string): Promise<ConversationDetail> {
  const res = await fetchWithRetry(`${base}/conversations/${convId}`, { headers: headers(password) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteConversation(password: string, convId: string): Promise<void> {
  const res = await fetchWithRetry(`${base}/conversations/${convId}`, {
    method: 'DELETE',
    headers: headers(password),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function listChanges(password: string, limit = 50): Promise<ChangeEntry[]> {
  const res = await fetchWithRetry(`${base}/changes?limit=${limit}`, { headers: headers(password) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.changes;
}

// Chat uses streaming — timeout and retry handled differently in ChatInterface
export async function sendChat(
  password: string,
  messages: Array<{ role: string; content: string }>,
  conversationId?: string,
  signal?: AbortSignal,
  images?: Array<{ data: string; mediaType: string; name?: string }>,
): Promise<Response> {
  // Create a timeout that will abort if no response starts within CHAT_TIMEOUT_MS
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

  // If caller provides a signal, forward its abort
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const res = await fetch(`${base}/chat`, {
      method: 'POST',
      headers: headers(password),
      body: JSON.stringify({ messages, conversationId, images }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 401 globally
    if (res.status === 401) {
      handle401();
    }

    // Handle 429 rate limit
    if (res.status === 429) {
      const data = await res.json().catch(() => ({}));
      const retryAfter = data.retryAfter || 60;
      throw new Error(`Rate limited. Please wait ${retryAfter} seconds before trying again.`);
    }

    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Check if backend is reachable (for status banner)
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${AGENT_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

// Export retry utilities for use in ChatInterface
export { isRetryableError, sleep, MAX_RETRIES, RETRY_DELAY_MS };
