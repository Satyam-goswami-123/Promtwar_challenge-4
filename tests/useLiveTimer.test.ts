import { test, expect, describe, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLiveTimer } from '../src/hooks/useLiveTimer';

describe('useLiveTimer Hook', () => {
  vi.useFakeTimers();

  test('initializes with start value', () => {
    const { result } = renderHook(() => useLiveTimer(1000, 90, 67));
    expect(result.current).toBe(67);
  });

  test('increments value over time up to maxValue', () => {
    const { result } = renderHook(() => useLiveTimer(1000, 70, 67));
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(68);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    // Should cap at 70
    expect(result.current).toBe(70);
  });
});
