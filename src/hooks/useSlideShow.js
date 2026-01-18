import { useState, useEffect, useCallback, useRef } from 'react';

export const useSlideShow = (length, interval = 10000) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const timerRef = useRef(null);

    const next = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % length);
    }, [length]);

    const prev = useCallback(() => {
        setCurrentIndex(prev => (prev - 1 + length) % length);
    }, [length]);

    const reset = useCallback(() => {
        setCurrentIndex(0);
        setIsPlaying(false);
    }, []);

    const togglePlayPause = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, []);

    useEffect(() => {
        if (!isPlaying) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            next();
        }, interval);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [interval, next, isPlaying, currentIndex]);

    return {
        currentIndex,
        isPlaying,
        next,
        prev,
        reset,
        togglePlayPause
    };
};

export default useSlideShow;
