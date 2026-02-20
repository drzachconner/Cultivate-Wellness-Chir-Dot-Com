import { useState, useEffect, useRef, useCallback } from 'react';

type DeployStatus = 'idle' | 'polling' | 'deployed';

const INITIAL_DELAY = 30_000;
const POLL_INTERVAL = 15_000;

export function useDeployPoller() {
  const [status, setStatus] = useState<DeployStatus>('idle');
  const [countdown, setCountdown] = useState<number | null>(null);
  const baselineEtag = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const startPolling = useCallback(() => {
    if (status === 'polling') return;

    fetch('/', { cache: 'no-store', method: 'HEAD' })
      .then((res) => {
        baselineEtag.current =
          res.headers.get('etag') || res.headers.get('last-modified') || null;
      })
      .catch(() => {
        baselineEtag.current = null;
      });

    setStatus('polling');
  }, [status]);

  const reset = useCallback(() => {
    setStatus('idle');
    setCountdown(null);
    baselineEtag.current = null;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (status !== 'polling') return;

    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch('/', { cache: 'no-store', method: 'HEAD' });
        const etag = res.headers.get('etag') || res.headers.get('last-modified');
        if (etag && baselineEtag.current && etag !== baselineEtag.current) {
          if (!cancelled) setStatus('deployed');
          return;
        }
      } catch {
        // network hiccup — keep polling
      }
      if (!cancelled) {
        timerRef.current = setTimeout(poll, POLL_INTERVAL);
      }
    };

    timerRef.current = setTimeout(poll, INITIAL_DELAY);

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [status]);

  useEffect(() => {
    if (status !== 'deployed') return;

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  return { status, countdown, startPolling, reset };
}
