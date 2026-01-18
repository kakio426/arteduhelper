import { describe, it, expect } from 'vitest';
import { cleanTranscript } from '../../../src/utils/transcriptParser';

describe('Transcript Parser', () => {
    it('should remove timestamps from lines', () => {
        const input = `
        [00:01] Hello everyone
        00:05 We are going to draw
        1:20 Next step is coloring
        `;
        const result = cleanTranscript(input);

        expect(result).toHaveLength(3);
        expect(result[0].text).toBe('Hello everyone');
        expect(result[1].text).toBe('We are going to draw');
        expect(result[2].text).toBe('Next step is coloring');
    });

    it('should ignore empty lines', () => {
        const input = `
        Line 1
        
        Line 2
        `;
        const result = cleanTranscript(input);
        expect(result).toHaveLength(2);
    });

    it('should generate unique IDs', () => {
        const input = `A\nB`;
        const result = cleanTranscript(input);
        expect(result[0].id).not.toBe(result[1].id);
    });
});
