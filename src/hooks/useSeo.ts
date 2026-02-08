import { SITE } from '../data/site';

export interface SeoProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  maxSnippet?: number;
  noSnippet?: boolean;
  robots?: string;
}

export function getSeoData({ title, description, canonical, ogImage, maxSnippet, noSnippet, robots }: SeoProps) {
  const fullTitle = title === SITE.name ? title : `${title} | ${SITE.name}`;
  const metaDescription = description || SITE.description;

  const robotsDirectives: string[] = [];
  if (robots) robotsDirectives.push(robots);
  if (maxSnippet) robotsDirectives.push(`max-snippet:${maxSnippet}`);
  if (noSnippet) robotsDirectives.push('nosnippet');

  return {
    fullTitle,
    metaDescription,
    canonical: canonical ? `https://${SITE.domain}${canonical}` : undefined,
    ogImage: ogImage ? `https://${SITE.domain}${ogImage}` : undefined,
    robotsContent: robotsDirectives.length > 0 ? robotsDirectives.join(', ') : undefined,
  };
}
