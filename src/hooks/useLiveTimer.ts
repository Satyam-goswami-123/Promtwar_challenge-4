import { useState, useEffect } from 'react';

export function useLiveTimer(intervalMs: number, maxValue: number, initialValue: number = 0) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(v => Math.min(v + 1, maxValue));
    }, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs, maxValue]);

  return value;
}
