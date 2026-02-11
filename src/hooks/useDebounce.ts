import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 다음 값이 들어오면 이전 타이머를 취소
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}