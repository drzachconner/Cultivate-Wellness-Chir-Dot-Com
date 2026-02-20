import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AGENT_URL, PROJECT_ID } from '../components/admin/constants';
import { PasswordGate } from '../components/admin/PasswordGate';
import { ChatInterface } from '../components/admin/ChatInterface';

export default function Admin() {
  const [password, setPassword] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  // Check for existing session (localStorage for "Remember me", sessionStorage for regular)
  useEffect(() => {
    const stored = localStorage.getItem('admin_auth') || sessionStorage.getItem('admin_auth');
    if (stored) {
      fetch(`${AGENT_URL}/api/v1/projects/${PROJECT_ID}/usage`, {
        headers: { Authorization: `Bearer ${stored}` },
      })
        .then((res) => {
          if (res.ok) {
            setPassword(stored);
          } else {
            localStorage.removeItem('admin_auth');
            sessionStorage.removeItem('admin_auth');
          }
        })
        .catch(() => {
          localStorage.removeItem('admin_auth');
          sessionStorage.removeItem('admin_auth');
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_auth');
    setPassword(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-dark" />
      </div>
    );
  }

  if (!password) {
    return <PasswordGate onAuth={setPassword} />;
  }

  return <ChatInterface password={password} onSignOut={handleSignOut} />;
}
