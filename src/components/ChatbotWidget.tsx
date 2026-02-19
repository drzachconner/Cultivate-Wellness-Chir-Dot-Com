import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Minus, Send, Loader2, Mic } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE = "Hi! I'm here to help answer questions about Cultivate Wellness Chiropractic. How can I assist you?";

const QUICK_QUESTIONS = [
  'How do I schedule?',
  'What ages do you see?',
  'First visit info',
  'Do you help with ADHD?',
  'Do you help with autism?',
  'Do you help with fertility?',
  'Do you help with sciatica?',
];

function formatInline(text: string, keyPrefix: string): React.ReactNode[] {
  // Split on bold (**text**), markdown links [text](url), and bare URLs
  const tokens = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s),]+)/g);
  return tokens.map((token, i) => {
    if (!token) return null;
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={`${keyPrefix}-b${i}`}>{token.slice(2, -2)}</strong>;
    }
    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={`${keyPrefix}-a${i}`}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 break-all"
        >
          {linkMatch[1]}
        </a>
      );
    }
    if (/^https?:\/\//.test(token)) {
      const label = token.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      return (
        <a
          key={`${keyPrefix}-u${i}`}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 break-all"
        >
          {label}
        </a>
      );
    }
    return token;
  });
}

function formatMessage(text: string) {
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((para, pIdx) => {
    const lines = para.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, lIdx) => {
      const formatted = formatInline(line, `${pIdx}-${lIdx}`);

      // Bullet points
      const bulletMatch = line.match(/^[-•]\s+(.*)/);
      if (bulletMatch) {
        elements.push(
          <div key={`${pIdx}-${lIdx}`} className="flex gap-1.5 ml-1 mt-1">
            <span className="shrink-0">•</span>
            <span>{formatted}</span>
          </div>
        );
      } else {
        if (lIdx > 0) elements.push(<br key={`br-${pIdx}-${lIdx}`} />);
        elements.push(<span key={`${pIdx}-${lIdx}`}>{formatted}</span>);
      }
    });

    return (
      <p key={pIdx} className={pIdx > 0 ? 'mt-3' : ''}>
        {elements}
      </p>
    );
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognitionCtor: (new () => any) | null =
  typeof window !== 'undefined'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition ?? null
    : null;

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) { stopListening(); return; }
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    let finalTranscript = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) { finalTranscript += t; } else { interim += t; }
      }
      setInput((prev) => {
        const prefix = prev ? prev.trimEnd() + ' ' : '';
        return prefix + finalTranscript + interim;
      });
    };

    recognition.onerror = () => { setIsListening(false); };
    recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, stopListening]);

  useEffect(() => {
    if (isLoading && isListening) stopListening();
  }, [isLoading, isListening, stopListening]);

  useEffect(() => {
    return () => { recognitionRef.current?.stop(); };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Show tooltip after delay to promote chatbot (8s to avoid overlap with MergerNotification)
  useEffect(() => {
    if (sessionStorage.getItem('chatTooltipDismissed')) return;
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const dismissTooltip = () => {
    setShowTooltip(false);
    sessionStorage.setItem('chatTooltipDismissed', 'true');
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    if (showTooltip) dismissTooltip();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15_000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "I'm getting a lot of questions right now. Please wait a moment and try again.",
          },
        ]);
      } else {
        const data = await response.json();

        if (response.ok && data.reply) {
          setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: "I'm sorry, I'm having trouble connecting. Please call (248) 616-0900.",
            },
          ]);
        }
      }
    } catch (err) {
      const isTimeout = err instanceof DOMException && err.name === 'AbortError';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isTimeout
            ? "That took too long. Please try again or call (248) 616-0900."
            : "I'm having trouble connecting. Please check your connection or call (248) 616-0900.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <>
      {/* Chat Tooltip */}
      {!isOpen && showTooltip && (
        <div className="fixed bottom-20 right-4 z-50 max-md:bottom-36 animate-bounce">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2.5 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">Ask me anything!</span>
            <button
              onClick={dismissTooltip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss tooltip"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="w-3 h-3 bg-white border-b border-r border-gray-200 rotate-45 absolute -bottom-1.5 right-6" />
        </div>
      )}

      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 bg-primary-dark hover:bg-primary-accent max-md:bottom-20"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Desktop: Close button when open */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="hidden md:flex fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-lg items-center justify-center transition-all duration-300 hover:scale-105 bg-gray-600"
          aria-label="Minimize chat"
        >
          <Minus className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white md:inset-auto md:bottom-20 md:right-4 md:w-96 md:h-[28rem] md:rounded-lg md:shadow-2xl md:border md:border-gray-200 max-md:bottom-16">
          {/* Header */}
          <div className="bg-primary-dark text-white px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">Cultivate Wellness</h3>
              <p className="text-xs text-primary-light">Ask me anything!</p>
            </div>
            {/* Close button in header */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shrink-0"
              aria-label="Minimize chat"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 bg-gray-50 min-h-0">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm break-words ${
                    message.role === 'user'
                      ? 'bg-primary-dark text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                  }`}
                >
                  {message.role === 'assistant' ? formatMessage(message.content) : message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm border border-gray-100 rounded-lg rounded-bl-none px-3 py-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-dark" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-white shrink-0">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs bg-primary-light/10 text-primary-dark px-3 py-1.5 rounded-full hover:bg-primary-light/20 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white shrink-0">
            <div className="flex gap-2 items-center">
              {SpeechRecognitionCtor && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-11 h-11 shrink-0 flex items-center justify-center rounded-lg transition-colors ${
                    isListening ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  disabled={isLoading}
                  aria-label={isListening ? 'Stop dictation' : 'Start dictation'}
                >
                  <span className="relative flex items-center justify-center">
                    <Mic className="w-5 h-5" />
                    {isListening && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </span>
                </button>
              )}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-w-0 h-11 px-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-11 h-11 shrink-0 bg-primary-dark text-white rounded-lg hover:bg-primary-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
