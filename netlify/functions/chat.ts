import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are a friendly, helpful assistant for Cultivate Wellness Chiropractic, a pediatric and family-focused chiropractic practice.

IMPORTANT UPDATE: Dr. Zach has merged with Van Every Family Chiropractic Center. Patients should now schedule appointments at the new Royal Oak location.

NEW LOCATION & CONTACT:
- Van Every Family Chiropractic Center
- Address: 4203 Rochester Rd, Royal Oak, MI 48073
- Phone: (248) 616-0900
- Website: vaneverychiropractic.com
- When calling, mention you're being referred from Cultivate Wellness Chiropractic to see Dr. Zach

ABOUT DR. ZACH CONNER:
- Credentials: DC, CACCP (Certified by the Academy Council of Chiropractic Pediatrics)
- Education: Life University College of Chiropractic
- Specialties: Pediatric Chiropractic, Prenatal Chiropractic, Talsky Tonal Chiropractic, Webster Technique, INSiGHT Scans
- Focus: Neurologically-focused, gentle chiropractic care for families

SERVICES:
1. Pediatric Chiropractic - Supporting children's nervous system development and overall wellness
2. Prenatal Chiropractic - Gentle care for expecting mothers, including Webster Technique
3. Family Chiropractic - Comprehensive care for the whole family

KEY INFORMATION:
- INSiGHT Scans: Non-invasive technology to assess nervous system function
- Talsky Tonal Chiropractic: A gentle, specific technique Dr. Zach uses
- First Visit: Comprehensive assessment including health history, exam, and INSiGHT scans

GUIDELINES:
- Be warm, friendly, and reassuring - many parents are nervous about chiropractic for their kids
- Keep responses concise (2-3 sentences typically)
- Always direct scheduling questions to call (248) 616-0900 or visit vaneverychiropractic.com
- For medical emergencies, advise calling 911
- Don't diagnose or give specific medical advice - encourage them to schedule a consultation
- If asked about insurance, explain that coverage varies and they should call the office to verify`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
}

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY not configured');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Chat service not configured' }),
    };
  }

  try {
    const body: RequestBody = JSON.parse(event.body || '{}');
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Messages array required' }),
      };
    }

    // Prepend system prompt
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-10), // Keep last 10 messages for context
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: fullMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to get response from AI' }),
      };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };
