import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE = "Hi! I'm here to help answer questions about Cultivate Wellness Chiropractic. How can I assist you?";

const QUICK_QUESTIONS = [
  'How do I schedule?',
  'What ages do you see?',
  'First visit info',
];

function formatMessage(text: string) {
  // Split into paragraphs on double newlines
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((para, pIdx) => {
    const lines = para.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, lIdx) => {
      // Bold: **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const formatted = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      // Bullet points
      const bulletMatch = line.match(/^[-•]\s+(.*)/);
      if (bulletMatch) {
        elements.push(
          <div key={`${pIdx}-${lIdx}`} className="flex gap-1.5 ml-1">
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
      <p key={pIdx} className={pIdx > 0 ? 'mt-2' : ''}>
        {elements}
      </p>
    );
  });
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

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
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I'm having trouble connecting. Please call (248) 616-0900.",
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
          aria-label="Close chat"
        >
          <X className="w-6 h-6 text-white" />
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
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
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
