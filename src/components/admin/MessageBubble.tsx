import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { Message } from './types';

// --- Inline parser ---
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  // Split on: **bold**, `code`, [link](url)
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return tokens.map((token, i) => {
    const key = `${keyPrefix}-${i}`;
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={key}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code key={key} className="bg-gray-100 text-primary-dark px-1 py-0.5 rounded text-xs font-mono">
          {token.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={key} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-accent break-all">
          {linkMatch[1]}
        </a>
      );
    }
    return token;
  });
}

// --- Code block with copy ---
function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative my-2 rounded-lg bg-gray-900 text-gray-100 text-xs font-mono overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 text-gray-400 text-[10px]">
        <span>{language || 'code'}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 hover:text-white transition-colors">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto"><code>{code}</code></pre>
    </div>
  );
}

// --- Table renderer ---
function MarkdownTable({ rows }: { rows: string[][] }) {
  if (rows.length < 2) return null;
  const header = rows[0];
  const body = rows.slice(2); // skip separator row

  return (
    <div className="my-2 overflow-x-auto">
      <table className="min-w-full text-xs border border-gray-200 rounded">
        <thead>
          <tr className="bg-gray-50">
            {header.map((cell, i) => (
              <th key={i} className="px-3 py-1.5 text-left font-semibold border-b border-gray-200">
                {cell.trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rIdx) => (
            <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-gray-50/50' : ''}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3 py-1.5 border-b border-gray-100">
                  {cell.trim()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Block-level parser ---
function renderMarkdown(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code blocks
    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      result.push(<CodeBlock key={`code-${result.length}`} code={codeLines.join('\n')} language={language} />);
      continue;
    }

    // Tables (line with |)
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableRows: string[][] = [];
      const tableStart = i;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim().startsWith('|')) {
        const cells = lines[i].split('|').slice(1, -1); // trim leading/trailing empty
        tableRows.push(cells);
        i++;
      }
      if (tableRows.length >= 2) {
        result.push(<MarkdownTable key={`table-${result.length}`} rows={tableRows} />);
        continue;
      }
      // If not a valid table, fall through
      i = tableStart;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      result.push(<hr key={`hr-${result.length}`} className="my-3 border-gray-200" />);
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      const className = level === 1 ? 'text-lg font-bold mt-3 mb-1' : level === 2 ? 'text-base font-bold mt-2 mb-1' : 'text-sm font-semibold mt-2 mb-0.5';
      result.push(
        <div key={`h-${result.length}`} className={className}>
          {renderInline(headingText, `h${result.length}`)}
        </div>
      );
      i++;
      continue;
    }

    // Numbered lists
    const numMatch = line.match(/^(\d+)[.)]\s+(.*)/);
    if (numMatch) {
      const items: { num: string; text: string }[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\d+)[.)]\s+(.*)/);
        if (!m) break;
        items.push({ num: m[1], text: m[2] });
        i++;
      }
      result.push(
        <ol key={`ol-${result.length}`} className="ml-1 mt-1 space-y-0.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-1.5">
              <span className="shrink-0 text-gray-400 text-sm">{item.num}.</span>
              <span>{renderInline(item.text, `ol${result.length}-${idx}`)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet lists
    if (/^[-\u2022*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-\u2022*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-\u2022*]\s+/, ''));
        i++;
      }
      result.push(
        <ul key={`ul-${result.length}`} className="ml-1 mt-1 space-y-0.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-1.5">
              <span className="shrink-0">&#8226;</span>
              <span>{renderInline(item, `ul${result.length}-${idx}`)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Empty line = paragraph break
    if (!line.trim()) {
      result.push(<div key={`br-${result.length}`} className="h-2" />);
      i++;
      continue;
    }

    // Regular text line
    result.push(
      <p key={`p-${result.length}`} className="mt-0.5">
        {renderInline(line, `p${result.length}`)}
      </p>
    );
    i++;
  }

  return result;
}

// --- Timestamp formatter ---
function formatTimestamp(dateStr?: string): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date);
  }
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}

// --- Main component ---
interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const timestamp = formatTimestamp(message.createdAt);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[92%] sm:max-w-[85%] lg:max-w-[70%] min-w-0">
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed overflow-hidden ${
            isUser
              ? 'bg-primary text-white rounded-br-md'
              : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-md'
          }`}
        >
          {isUser ? message.content : renderMarkdown(message.content)}
        </div>
        {timestamp && (
          <div className={`text-[10px] text-gray-400 mt-0.5 ${isUser ? 'text-right' : 'text-left'} px-1`}>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}

// Export for streaming content too
export function StreamingBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] sm:max-w-[85%] lg:max-w-[70%] min-w-0 px-4 py-3 rounded-2xl rounded-bl-md text-sm leading-relaxed bg-white text-gray-800 shadow-sm border border-gray-200 overflow-hidden">
        {renderMarkdown(content)}
        <span className="inline-block w-0.5 h-4 bg-primary-dark ml-0.5 animate-pulse" />
      </div>
    </div>
  );
}
