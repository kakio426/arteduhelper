import { renderHook, act } from '@testing-library/react';
import { useSlideShow } from '../../../src/hooks/useSlideShow';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useSlideShow Hook', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should initialize with index 0 and status not playing', () => {
        const { result } = renderHook(() => useSlideShow(5, 5000));
        expect(result.current.currentIndex).toBe(0);
        expect(result.current.isPlaying).toBe(false);
    });

    it('should advance to next index', () => {
        const { result } = renderHook(() => useSlideShow(5, 5000));
        act(() => {
            result.current.next();
        });
        expect(result.current.currentIndex).toBe(1);
    });

    it('should go to previous index', () => {
        const { result } = renderHook(() => useSlideShow(5, 5000));
        act(() => {
            result.current.next();
            result.current.prev();
        });
        expect(result.current.currentIndex).toBe(0);
    });

    it('should wrap around at the end', () => {
        const { result } = renderHook(() => useSlideShow(3, 5000));
        act(() => {
            result.current.next(); // 1
            result.current.next(); // 2
            result.current.next(); // 0
        });
        expect(result.current.currentIndex).toBe(0);
    });

    it('should wrap around at the beginning', () => {
        const { result } = renderHook(() => useSlideShow(3, 5000));
        act(() => {
            result.current.prev(); // 2
        });
        expect(result.current.currentIndex).toBe(2);
    });

    it('should advance automatically when playing', () => {
        const { result } = renderHook(() => useSlideShow(5, 1000));

        act(() => {
            result.current.togglePlayPause(); // Start playing
        });

        act(() => {
            vi.advanceTimersByTime(1001);
        });
        expect(result.current.currentIndex).toBe(1);

        act(() => {
            vi.advanceTimersByTime(1001);
        });
        expect(result.current.currentIndex).toBe(2);
    });

    it('should not advance automatically when paused', () => {
        const { result } = renderHook(() => useSlideShow(5, 1000));
        // isPlaying remains false

        act(() => {
            vi.advanceTimersByTime(1001);
        });
        expect(result.current.currentIndex).toBe(0);
    });

    it('should reset to index 0 and stop playing', () => {
        const { result } = renderHook(() => useSlideShow(5, 1000));

        act(() => {
            result.current.togglePlayPause();
            result.current.next();
            result.current.next();
        });
        expect(result.current.currentIndex).toBe(2);
        expect(result.current.isPlaying).toBe(true);

        act(() => {
            result.current.reset();
        });
        expect(result.current.currentIndex).toBe(0);
        expect(result.current.isPlaying).toBe(false);
    });
});
