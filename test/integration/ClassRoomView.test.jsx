import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ClassRoom from '../../src/pages/ClassRoom';
import { initialState } from '../../src/store/classDataReducer';

// Mock child components to focus on Integration
vi.mock('../../src/components/VideoLooper', () => ({
    default: ({ videoId }) => <div data-testid="video-looper">Video: {videoId}</div>
}));

vi.mock('../../src/components/InstructionViewer', () => ({
    default: ({ steps }) => <div data-testid="instruction-viewer">Steps: {steps.length}</div>
}));

describe('ClassRoom Integration', () => {
    it('should render split screen with video and instructions', () => {
        const mockState = {
            ...initialState,
            videoUrl: 'https://www.youtube.com/watch?v=abc12345678',
            steps: [{ id: 1, text: 'Step 1' }]
        };

        // We assume ClassRoom takes state as props or uses a context later. 
        // For now, let's pass it as props for simplicity in Phase 3.
        render(<ClassRoom state={mockState} />);

        expect(screen.getByTestId('video-looper')).toBeInTheDocument();
        expect(screen.getByTestId('video-looper')).toHaveTextContent('Video: abc12345678'); // Assuming extract ID logic is used inside or passed

        expect(screen.getByTestId('instruction-viewer')).toBeInTheDocument();
        expect(screen.getByTestId('instruction-viewer')).toHaveTextContent('Steps: 1');
    });
});
