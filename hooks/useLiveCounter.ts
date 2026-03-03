import { useState, useEffect, useRef, useCallback } from "react";

export function useLiveCounter(startValue: number, isActive: boolean) {
  const [value, setValue] = useState(startValue);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setValue((prev) => prev + Math.floor(Math.random() * 80) + 20);
      }, 300);
    } else {
      clear();
    }
    return clear;
  }, [isActive, clear]);

  return value;
}
