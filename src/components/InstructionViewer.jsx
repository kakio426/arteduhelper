import React from 'react';
import useSlideShow from '../hooks/useSlideShow';
import {
    Play,
    Pause,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Clock,
    Sparkles
} from 'lucide-react';

const InstructionViewer = ({ steps, interval }) => {
    const {
        currentIndex,
        isPlaying,
        next,
        prev,
        reset,
        togglePlayPause
    } = useSlideShow(steps.length, interval);

    const currentStep = steps[currentIndex];
    const progress = ((currentIndex + 1) / steps.length) * 100;

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

            {/* Playful Decorations */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.2, color: 'var(--accent-pink)' }}>
                <Sparkles size={60} />
            </div>

            {/* Progress Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: 'var(--accent-pink)',
                            background: '#FDF2F8',
                            padding: '0.2rem 1rem',
                            borderRadius: '999px'
                        }}>
                            단계 {currentIndex + 1}
                        </span>
                        <span style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>/ {steps.length}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-sub)', fontSize: '0.85rem' }}>
                        <Clock size={14} />
                        {isPlaying ? '자동 넘김 켜짐' : '일시정지'}
                    </div>
                </div>
                <div className="progress-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Instruction Body */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem' }}>
                <div key={currentIndex} className="fade-in">
                    <h2 style={{
                        fontSize: '3rem',
                        fontWeight: '700',
                        lineHeight: '1.3',
                        color: 'var(--text-main)',
                        wordBreak: 'keep-all'
                    }}>
                        {currentStep.text}
                    </h2>
                </div>
            </div>

            {/* Controls Footer */}
            <div style={{
                marginTop: 'auto',
                paddingTop: '2rem',
                borderTop: '2px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <button
                    className="btn btn-secondary"
                    onClick={prev}
                    disabled={currentIndex === 0}
                    style={{ padding: '1.25rem' }}
                    aria-label="Previous step"
                >
                    <ChevronLeft size={28} />
                </button>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={togglePlayPause}
                        style={{
                            padding: '1rem 2.5rem',
                            fontSize: '1.1rem',
                            minWidth: '160px'
                        }}
                    >
                        {isPlaying ? <><Pause fill="white" size={20} /> 정지</> : <><Play fill="white" size={20} /> 시작</>}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={reset}
                        style={{ padding: '1rem' }}
                        aria-label="Reset slideshow"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={next}
                    disabled={currentIndex === steps.length - 1}
                    style={{ padding: '1.25rem' }}
                    aria-label="Next step"
                >
                    <ChevronRight size={28} />
                </button>
            </div>
        </div>
    );
};

export default InstructionViewer;
