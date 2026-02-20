import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface PanelInfo {
  id: string;
  isMinimized: boolean;
  size: 'compact' | 'medium' | 'large';
  initialX: number;
  initialY: number;
}

interface AdminContextValue {
  panels: PanelInfo[];
  isAuthenticated: boolean;
  password: string | null;
  hasAnyPanel: boolean;
  authenticate: (pw: string) => void;
  signOut: () => void;
  addPanel: () => void;
  removePanel: (id: string) => void;
  minimizePanel: (id: string) => void;
  restorePanel: (id: string) => void;
  setPanelSize: (id: string, size: 'compact' | 'medium' | 'large') => void;
}

const SESSION_KEY = 'admin_panels_state';

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

// Offset each new panel by 30px so they don't stack exactly
function nextPosition(panels: PanelInfo[]): { x: number; y: number } {
  const base = { x: 20, y: 80 };
  const offset = panels.length * 30;
  return { x: base.x + offset, y: base.y + offset };
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [panels, setPanels] = useState<PanelInfo[]>(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed.panels) ? parsed.panels : [];
      }
    } catch { /* ignore */ }
    return [];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState<string | null>(null);

  // Rehydrate auth from storage
  useEffect(() => {
    const stored = sessionStorage.getItem('admin_auth');
    if (stored) {
      setPassword(stored);
      setIsAuthenticated(true);
    }
  }, []);

  // Persist panels to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ panels }));
    } catch { /* ignore */ }
  }, [panels]);

  const addPanel = useCallback(() => {
    setPanels((prev) => {
      const pos = nextPosition(prev);
      const newPanel: PanelInfo = {
        id: crypto.randomUUID(),
        isMinimized: false,
        size: 'medium',
        initialX: pos.x,
        initialY: pos.y,
      };
      return [...prev, newPanel];
    });
  }, []);

  const removePanel = useCallback((id: string) => {
    setPanels((prev) => prev.filter((p) => p.id !== id));
    // Clean up drag position from sessionStorage
    try { sessionStorage.removeItem(`admin_drag_${id}`); } catch { /* ignore */ }
  }, []);

  const minimizePanel = useCallback((id: string) => {
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, isMinimized: true } : p)));
  }, []);

  const restorePanel = useCallback((id: string) => {
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, isMinimized: false } : p)));
  }, []);

  const setPanelSize = useCallback((id: string, size: 'compact' | 'medium' | 'large') => {
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, size } : p)));
  }, []);

  const authenticate = useCallback((pw: string) => {
    sessionStorage.setItem('admin_auth', pw);
    setPassword(pw);
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword(null);
    setPanels([]);
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }, []);

  const hasAnyPanel = panels.length > 0;

  return (
    <AdminContext.Provider value={{
      panels, isAuthenticated, password, hasAnyPanel,
      authenticate, signOut, addPanel, removePanel,
      minimizePanel, restorePanel, setPanelSize,
    }}>
      {children}
    </AdminContext.Provider>
  );
}
