import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchUsage } from './api';

interface PasswordGateProps {
  onAuth: (password: string) => void;
}

export function PasswordGate({ onAuth }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setError('');
    setLoading(true);
    try {
      await fetchUsage(password);
      // If fetchUsage succeeds, password is valid
      if (remember) {
        localStorage.setItem('admin_auth', password);
      } else {
        sessionStorage.setItem('admin_auth', password);
      }
      onAuth(password);
    } catch {
      setError('Incorrect password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-heading font-bold text-primary-dark text-center mb-2">
          Admin Panel
        </h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Enter your password to manage website content.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-3"
            disabled={loading}
          />
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full h-12 bg-primary-dark text-white rounded-lg font-semibold hover:bg-primary-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
