import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE } from '../data/site';

export default function AdminRedirect() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const shouldActivate =
      pathname === '/admin' ||
      pathname === '/admin/' ||
      new URLSearchParams(search).get('admin') === 'true';

    if (!shouldActivate) return;

    // Don't double-load
    if (document.querySelector('script[data-admin-embed]')) return;

    const script = document.createElement('script');
    script.src = 'https://agent.drzach.ai/embed.js';
    script.dataset.project = SITE.deployment.adminProjectId;
    script.dataset.adminEmbed = 'true';
    document.body.appendChild(script);
  }, [pathname, search]);

  return null;
}
