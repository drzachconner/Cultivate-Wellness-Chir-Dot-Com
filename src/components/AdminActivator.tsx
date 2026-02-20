import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

export default function AdminActivator() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { addPanel, panels } = useAdmin();

  useEffect(() => {
    if (pathname === '/admin') {
      if (panels.length === 0) addPanel();
      navigate('/', { replace: true });
      return;
    }

    const params = new URLSearchParams(search);
    if (params.get('admin') === 'true') {
      if (panels.length === 0) addPanel();
      params.delete('admin');
      const remaining = params.toString();
      navigate(pathname + (remaining ? `?${remaining}` : ''), { replace: true });
    }
  }, [pathname, search, addPanel, navigate, panels.length]);

  return null;
}
