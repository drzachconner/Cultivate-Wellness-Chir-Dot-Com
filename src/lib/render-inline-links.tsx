import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Parses markdown-style [text](url) links in a string.
 * Internal links (starting with /) render as React Router <Link>.
 * External links render as <a> with rel="noopener noreferrer".
 */
export function renderInlineLinks(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const [, label, url] = match;
    if (url.startsWith('/')) {
      parts.push(
        <Link key={match.index} to={url} className="text-primary-dark underline hover:text-primary-accent">
          {label}
        </Link>
      );
    } else {
      parts.push(
        <a key={match.index} href={url} className="text-primary-dark underline hover:text-primary-accent" target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex === 0) return text;
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts}</>;
}

/**
 * Strips markdown-style [text](url) links to plain text for Schema.org output.
 */
export function stripInlineLinks(text: string): string {
  return text.replace(LINK_RE, '$1');
}
