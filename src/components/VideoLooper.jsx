import React, { useRef } from 'react';
import YouTube from 'react-youtube';

const VideoLooper = ({ videoId, autoPlay = true }) => {
    const playerRef = useRef(null);

    const onPlayerReady = (event) => {
        playerRef.current = event.target;
        if (autoPlay) {
            event.target.playVideo();
        }
    };

    const handleVideoEnd = (event) => {
        event.target.seekTo(0);
        event.target.playVideo();
    };

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: autoPlay ? 1 : 0,
            controls: 1, // Show controls so clicking play/pause is possible manually if needed
            rel: 0, // No related videos
        },
    };

    return (
        <div style={{ width: '100%', height: '100%', background: 'black' }}>
            <YouTube
                videoId={videoId}
                opts={opts}
                onReady={onPlayerReady}
                onEnd={handleVideoEnd}
                style={{ width: '100%', height: '100%' }}
                className="youtube-player" // For potential CSS targeting
            />
        </div>
    );
};

export default VideoLooper;
