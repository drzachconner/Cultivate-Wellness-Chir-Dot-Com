import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE } from '../data/site';

const ADMIN_URL = 'https://agent.drzach.ai/admin';

export default function AdminRedirect() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (pathname === '/admin' || new URLSearchParams(search).get('admin') === 'true') {
      window.location.href = `${ADMIN_URL}/${SITE.deployment.adminProjectId}`;
    }
  }, [pathname, search]);

  return null;
}
