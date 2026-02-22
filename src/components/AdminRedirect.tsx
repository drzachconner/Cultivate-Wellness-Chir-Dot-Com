import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ADMIN_URL = 'https://agent.drzach.ai/admin';
const PROJECT_ID = 'cultivate-wellness';

export default function AdminRedirect() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (pathname === '/admin' || new URLSearchParams(search).get('admin') === 'true') {
      window.location.href = `${ADMIN_URL}/${PROJECT_ID}`;
    }
  }, [pathname, search]);

  return null;
}
