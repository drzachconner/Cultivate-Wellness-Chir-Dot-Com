import { useState, useCallback, useRef, useEffect } from 'react';

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function loadPosition(fallback: { x: number; y: number }, key: string) {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return fallback;
}

export function useDraggable(initial: { x: number; y: number }, storageKey = 'admin_drag_pos') {
  const [position, setPosition] = useState(() => loadPosition(initial, storageKey));
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(position));
    } catch {
      // ignore
    }
  }, [position, storageKey]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
      setIsDragging(true);
    },
    [position]
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 50;
      setPosition({
        x: clamp(e.clientX - offset.current.x, 0, maxX),
        y: clamp(e.clientY - offset.current.y, 0, maxY),
      });
    };

    const onMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  return { position, isDragging, onMouseDown, setPosition };
}
