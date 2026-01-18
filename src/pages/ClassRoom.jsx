import React, { useState } from 'react';
import VideoLooper from '../components/VideoLooper';
import InstructionViewer from '../components/InstructionViewer';
import { extractVideoId } from '../utils/youtubeParser';
import { Maximize2, Minimize2, ChevronLeft } from 'lucide-react';

const ClassRoom = ({ state, onBack }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoId = extractVideoId(state.videoUrl);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-color)' }}>
            {/* Nav Header */}
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={onBack} style={{ padding: '0.5rem 1rem' }}>
                        <ChevronLeft size={18} /> 나가기
                    </button>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>미술 수업 진행 중...</h1>
                </div>
                <button className="btn btn-secondary" onClick={toggleFullscreen} style={{ padding: '0.5rem' }}>
                    {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                </button>
            </header>

            {/* Main Content Area */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
                gap: '1.5rem',
                padding: '1.5rem',
                height: 'calc(100vh - 70px)',
                overflow: 'hidden'
            }}>
                {/* Left: Video */}
                <div style={{
                    flex: 1,
                    background: '#000',
                    borderRadius: '2rem',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    position: 'relative'
                }}>
                    <VideoLooper videoId={videoId} />
                </div>

                {/* Right: Instructions */}
                <div style={{
                    flex: 1,
                    height: '100%'
                }}>
                    <InstructionViewer
                        steps={state.steps}
                        interval={Number(state.stepInterval) * 1000}
                    />
                </div>
            </main>
        </div>
    );
};

export default ClassRoom;
