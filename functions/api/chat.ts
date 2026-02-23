import { isAllowed, getClientIP } from '../lib/rate-limit';
import { SITE_CONFIG } from '../lib/site-config';
import { SYSTEM_PROMPT } from '../data/system-prompt';

interface Env {
  OPENAI_API_KEY: string;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Rate limit: 60 requests per minute per IP.
// Normal chatbot usage is 2-3 msgs/min max. This only catches bots.
const CHAT_RATE_LIMIT = 60;
const CHAT_RATE_WINDOW = 60 * 1000;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
}

function getCorsOrigin(request: Request): string {
  const origin = request.headers.get('Origin') || '';
  return SITE_CONFIG.allowedOrigins.includes(origin) ? origin : SITE_CONFIG.allowedOrigins[0];
}

export const onRequestOptions: PagesFunction<Env> = async (context) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': getCorsOrigin(context.request),
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsOrigin = getCorsOrigin(context.request);
  const headers = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  const clientIP = getClientIP(context.request);
  if (!isAllowed(`chat:${clientIP}`, CHAT_RATE_LIMIT, CHAT_RATE_WINDOW)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }), {
      status: 429,
      headers: { ...headers, 'Retry-After': '60' },
    });
  }

  const apiKey = context.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY not configured');
    return new Response(JSON.stringify({ error: 'Chat service not configured' }), {
      status: 500,
      headers,
    });
  }

  try {
    const body: RequestBody = await context.request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array required' }), {
        status: 400,
        headers,
      });
    }

    // Enforce per-message character limit to prevent token abuse
    const MAX_MESSAGE_LENGTH = 2000;
    for (const msg of messages) {
      if (typeof msg.content !== 'string' || msg.content.length > MAX_MESSAGE_LENGTH) {
        return new Response(JSON.stringify({ error: `Messages must be under ${MAX_MESSAGE_LENGTH} characters` }), {
          status: 400,
          headers,
        });
      }
    }

    // Prepend system prompt
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-10), // Keep last 10 messages for context
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to get response from AI' }), {
        status: 500,
        headers,
      });
    }

    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Chat function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers,
    });
  }
};
