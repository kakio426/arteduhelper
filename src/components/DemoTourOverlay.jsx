import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, X, Sparkles } from 'lucide-react';

const tourSteps = [
    {
        target: null,
        title: '👋 안녕하세요!',
        message: '미술 수업을 도와주는 AI 보조 도구입니다. 어떻게 사용하는지 안내해 드릴게요!',
        position: 'center'
    },
    {
        target: 'api-key-section',
        title: '🔑 API 키 입력',
        message: 'Gemini API 키를 입력해주세요. "키 발급받기"를 클릭하면 무료로 발급받을 수 있어요!',
        position: 'bottom'
    },
    {
        target: 'youtube-url-section',
        title: '📺 영상 주소 입력',
        message: '수업에 사용할 YouTube 영상 주소를 붙여넣으세요. 미술 강좌, 만들기 영상 등이 좋아요!',
        position: 'bottom'
    },
    {
        target: 'ai-generate-btn',
        title: '✨ AI 자동 생성',
        message: '이 버튼을 누르면 AI가 영상을 분석해서 수업 단계를 자동으로 만들어줍니다!',
        position: 'bottom'
    },
    {
        target: 'tips-section',
        title: '💡 중요한 팁!',
        message: '배경음악만 있거나 말이 적은 영상은 AI가 분석하기 어려워요. 그럴 땐 아래에서 직접 단계를 입력하거나 대본을 붙여넣으세요!',
        position: 'bottom'
    },
    {
        target: 'steps-section',
        title: '📝 단계 편집',
        message: 'AI가 생성한 단계를 수정하거나, 직접 단계를 추가할 수 있어요. 각 단계에 이미지도 첨부할 수 있고, Ctrl+V로 스크린샷도 붙여넣기 가능해요!',
        position: 'top'
    },
    {
        target: 'start-btn',
        title: '🚀 수업 시작',
        message: '모든 준비가 끝나면 이 버튼을 눌러 수업을 시작하세요! 전체화면으로 학생들에게 보여줄 수 있어요.',
        position: 'top'
    }
];

const DemoTourOverlay = ({ currentStep, onNext, onClose, onComplete }) => {
    const [targetRect, setTargetRect] = useState(null);
    const step = tourSteps[currentStep];

    useEffect(() => {
        if (step?.target) {
            const element = document.getElementById(step.target);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);
                // Scroll element into view
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            setTargetRect(null);
        }
    }, [currentStep, step?.target]);

    if (!step) return null;

    const isLastStep = currentStep === tourSteps.length - 1;

    // Calculate message box position
    const getMessageStyle = () => {
        if (!targetRect || step.position === 'center') {
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            };
        }

        const padding = 20;
        if (step.position === 'bottom') {
            return {
                top: `${targetRect.bottom + padding}px`,
                left: `${targetRect.left + targetRect.width / 2}px`,
                transform: 'translateX(-50%)'
            };
        } else {
            return {
                top: `${targetRect.top - padding}px`,
                left: `${targetRect.left + targetRect.width / 2}px`,
                transform: 'translate(-50%, -100%)'
            };
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999
        }}>
            {/* Dark overlay with spotlight hole */}
            <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                    <mask id="spotlight-mask">
                        <rect width="100%" height="100%" fill="white" />
                        {targetRect && (
                            <rect
                                x={targetRect.left - 10}
                                y={targetRect.top - 10}
                                width={targetRect.width + 20}
                                height={targetRect.height + 20}
                                rx="16"
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="rgba(0, 0, 0, 0.7)"
                    mask="url(#spotlight-mask)"
                />
            </svg>

            {/* Highlight border around target */}
            {targetRect && (
                <div style={{
                    position: 'absolute',
                    top: targetRect.top - 10,
                    left: targetRect.left - 10,
                    width: targetRect.width + 20,
                    height: targetRect.height + 20,
                    border: '3px solid var(--accent-blue)',
                    borderRadius: '16px',
                    boxShadow: '0 0 30px rgba(56, 189, 248, 0.5)',
                    pointerEvents: 'none'
                }} />
            )}

            {/* Message Box */}
            <div style={{
                position: 'absolute',
                ...getMessageStyle(),
                background: 'white',
                borderRadius: '1.5rem',
                padding: '2rem',
                maxWidth: '400px',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                animation: 'fadeIn 0.3s ease'
            }}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#F1F5F9',
                        border: 'none',
                        borderRadius: '50%',
                        width: '2rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748B'
                    }}
                >
                    <X size={16} />
                </button>

                {/* Progress */}
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                    {tourSteps.map((_, idx) => (
                        <div
                            key={idx}
                            style={{
                                width: idx === currentStep ? '1.5rem' : '0.5rem',
                                height: '0.25rem',
                                borderRadius: '999px',
                                background: idx <= currentStep ? 'var(--accent-blue)' : '#E2E8F0',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                    {step.title}
                </h3>
                <p style={{ fontSize: '1rem', color: 'var(--text-sub)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {step.message}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                        {currentStep + 1} / {tourSteps.length}
                    </span>
                    <button
                        onClick={isLastStep ? onComplete : onNext}
                        style={{
                            background: 'var(--accent-blue)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {isLastStep ? (
                            <><Sparkles size={18} /> 완료!</>
                        ) : (
                            <>다음 <ChevronRight size={18} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DemoTourOverlay;
