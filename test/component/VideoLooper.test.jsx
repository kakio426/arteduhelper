import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VideoLooper from '../../src/components/VideoLooper';

// We need a way to spy on the player methods that the component calls.
const mockSeekTo = vi.fn();
const mockPlayVideo = vi.fn();

vi.mock('react-youtube', () => {
    return {
        default: ({ videoId, onEnd }) => {
            return (
                <div>
                    <div data-testid="youtube-player">Video {videoId}</div>
                    <button
                        data-testid="end-btn"
                        onClick={() => onEnd({ target: { seekTo: mockSeekTo, playVideo: mockPlayVideo } })}
                    >
                        End Video
                    </button>
                </div>
            );
        }
    };
});

describe('VideoLooper Component', () => {
    it('should render video player', () => {
        render(<VideoLooper videoId="test_id" />);
        expect(screen.getByTestId('youtube-player')).toHaveTextContent('Video test_id');
    });

    it('should loop video when it ends', () => {
        render(<VideoLooper videoId="test_id" />);

        const endBtn = screen.getByTestId('end-btn');
        endBtn.click();

        expect(mockSeekTo).toHaveBeenCalledWith(0);
        expect(mockPlayVideo).toHaveBeenCalled();
    });
});
