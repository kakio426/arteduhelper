import { describe, it, expect } from 'vitest';
import { extractVideoId } from '../../../src/utils/youtubeParser';

describe('YouTube Parser Utility', () => {
    it('should extract ID from standard URL', () => {
        const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract ID from shared URL (youtu.be)', () => {
        const url = 'https://youtu.be/dQw4w9WgXcQ';
        expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should return null for invalid URL', () => {
        const url = 'https://google.com';
        expect(extractVideoId(url)).toBeNull();
    });

    it('should extract ID when extra parameters exist', () => {
        const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s';
        expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });
});
