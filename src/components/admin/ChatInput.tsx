import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, X, Mic } from 'lucide-react';
import type { ImageAttachment } from './types';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string, images?: ImageAttachment[]) => void;
  onCancel: () => void;
  isStreaming: boolean;
}

const MAX_IMAGES = 5;

const fileToAttachment = (file: File): Promise<ImageAttachment> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve({
        id: crypto.randomUUID(),
        data: base64,
        mediaType: file.type || 'image/png',
        name: file.name,
        previewUrl: dataUrl,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognitionCtor: (new () => any) | null =
  typeof window !== 'undefined'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition ?? null
    : null;

export function ChatInput({ value, onChange, onSend, onCancel, isStreaming }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      return;
    }
    if (!SpeechRecognitionCtor) {
      alert('Voice input is not supported in this browser. Please use Chrome for voice dictation.');
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    let finalTranscript = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }
      const prefix = value ? value.trimEnd() + ' ' : '';
      onChange(prefix + finalTranscript + interim);
    };

    recognition.onerror = () => { setIsListening(false); };
    recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, stopListening, value, onChange]);

  useEffect(() => {
    if (isStreaming && isListening) stopListening();
  }, [isStreaming, isListening, stopListening]);

  useEffect(() => {
    return () => { recognitionRef.current?.stop(); };
  }, []);

  const addImages = async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    const toAdd = imageFiles.slice(0, remaining);

    const attachments = await Promise.all(toAdd.map(fileToAttachment));
    setImages((prev) => [...prev, ...attachments].slice(0, MAX_IMAGES));
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() && images.length === 0) return;
    onSend(value, images.length > 0 ? images : undefined);
    setImages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!value.trim() && images.length === 0) return;
      onSend(value, images.length > 0 ? images : undefined);
      setImages([]);
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const files = e.clipboardData?.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        e.preventDefault();
        addImages(imageFiles);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addImages(Array.from(e.dataTransfer.files));
    }
  };

  const canSend = value.trim() || images.length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-gray-200 bg-white shrink-0 ${isDragging ? 'ring-2 ring-primary ring-inset' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Image previews */}
      {images.length > 0 && (
        <div className="flex gap-2 mb-2 px-1 flex-wrap">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.previewUrl}
                alt={img.name}
                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-end">
        {/* Paperclip button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-12 shrink-0 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isStreaming}
          aria-label="Attach image"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addImages(Array.from(e.target.files));
            e.target.value = '';
          }}
        />

        <button
          type="button"
          onClick={toggleListening}
          className={`w-10 h-12 shrink-0 flex items-center justify-center transition-colors ${
            isListening ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
          }`}
          disabled={isStreaming}
          aria-label={isListening ? 'Stop dictation' : 'Start dictation'}
        >
          <span className="relative flex items-center justify-center">
            <Mic className="w-5 h-5" />
            {isListening && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            )}
          </span>
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onPaste={handlePaste}
          placeholder="Tell me what to change..."
          rows={1}
          className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-xl text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isStreaming}
          style={{ maxHeight: '120px' }}
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={onCancel}
            className="w-12 h-12 shrink-0 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center"
            aria-label="Stop"
          >
            <div className="w-4 h-4 bg-white rounded-sm" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            className="w-12 h-12 shrink-0 bg-primary-dark text-white rounded-xl hover:bg-primary-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
}
