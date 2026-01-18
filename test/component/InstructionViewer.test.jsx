import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import InstructionViewer from '../../src/components/InstructionViewer';
import '@testing-library/jest-dom';

describe('InstructionViewer Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const mockSteps = [
        { id: 1, text: 'Step 1: Draw a circle' },
        { id: 2, text: 'Step 2: Draw a square' },
        { id: 3, text: 'Step 3: Color it in' }
    ];

    it('should render the first step initially', () => {
        render(<InstructionViewer steps={mockSteps} />);
        expect(screen.getByText('Step 1: Draw a circle')).toBeInTheDocument();
    });

    it('should advance to the next step after interval when started', () => {
        render(<InstructionViewer steps={mockSteps} interval={5000} />);

        // Start playing
        const startButton = screen.getByText(/시작/);
        act(() => startButton.click());

        act(() => {
            vi.advanceTimersByTime(5500);
        });

        expect(screen.getByText('Step 2: Draw a square')).toBeInTheDocument();
    });

    it('should allow manual navigation via buttons', () => {
        render(<InstructionViewer steps={mockSteps} />);

        const nextButtons = screen.getAllByRole('button');
        // Based on the order in JSX: Prev, Play/Pause, Reset, Next
        // Next is the last button
        const nextButton = screen.getByLabelText('Next step');
        const prevButton = screen.getByLabelText('Previous step');

        act(() => nextButton.click());
        expect(screen.getByText('Step 2: Draw a square')).toBeInTheDocument();

        act(() => prevButton.click());
        expect(screen.getByText('Step 1: Draw a circle')).toBeInTheDocument();
    });

    it('should show play/pause controls and respect it', () => {
        render(<InstructionViewer steps={mockSteps} interval={5000} />);

        // Initially not playing
        act(() => {
            vi.advanceTimersByTime(5500);
        });
        expect(screen.getByText('Step 1: Draw a circle')).toBeInTheDocument();

        // Start playing
        const startButton = screen.getByText(/시작/);
        act(() => startButton.click());

        act(() => {
            vi.advanceTimersByTime(5500);
        });
        expect(screen.getByText('Step 2: Draw a square')).toBeInTheDocument();

        // Stop playing
        const stopButton = screen.getByText(/정지/);
        act(() => stopButton.click());

        act(() => {
            vi.advanceTimersByTime(5500);
        });
        // Should stay on Step 2
        expect(screen.getByText('Step 2: Draw a square')).toBeInTheDocument();
    });
});
