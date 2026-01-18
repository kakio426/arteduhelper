import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const tutorialSlides = [
    {
        title: '👋 환영합니다!',
        description: '이 앱은 미술 수업 영상을 틀어놓고, 선생님 대신 수업 단계를 자동으로 보여주는 도우미예요.',
        tip: '지금 체험용 데이터가 자동으로 입력되었습니다!'
    },
    {
        title: '📺 영상 & 단계 설정',
        description: '유튜브 영상 URL을 입력하면 화면 왼쪽에 미리보기가 나타나요. 오른쪽에서 수업 단계를 직접 수정하거나 AI가 자동 생성해 줄 수도 있어요!',
        tip: '📷 각 단계에 참고 이미지도 붙여넣기(Ctrl+V)로 추가할 수 있어요.'
    },
    {
        title: '🎬 수업 시작하기',
        description: '설정이 끝나면 하단의 분홍색 "수업 시작하기" 버튼을 눌러주세요. 영상과 단계 안내가 나란히 표시됩니다!',
        tip: '⏱️ 슬라이드 간격(초)을 조절하면 자동 넘김 속도를 바꿀 수 있어요.'
    },
    {
        title: '✨ 수업 진행 화면',
        description: '왼쪽엔 영상이 반복 재생되고, 오른쪽엔 큼직한 글씨와 이미지로 단계가 표시돼요. 학생들이 멀리서도 잘 볼 수 있답니다!',
        tip: '🔲 전체화면 버튼으로 더 크게 볼 수 있어요.'
    }
];

const TutorialModal = ({ isOpen, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    if (!isOpen) return null;

    const handleNext = () => {
        if (currentSlide < tutorialSlides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const slide = tutorialSlides[currentSlide];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '2rem',
                padding: '2.5rem',
                maxWidth: '500px',
                width: '90%',
                position: 'relative',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                animation: 'fadeIn 0.3s ease'
            }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#F1F5F9',
                        border: 'none',
                        borderRadius: '50%',
                        width: '2.5rem',
                        height: '2.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748B'
                    }}
                >
                    <X size={20} />
                </button>

                {/* Progress Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {tutorialSlides.map((_, idx) => (
                        <div
                            key={idx}
                            style={{
                                width: idx === currentSlide ? '2rem' : '0.5rem',
                                height: '0.5rem',
                                borderRadius: '999px',
                                background: idx === currentSlide ? 'var(--accent-blue)' : '#E2E8F0',
                                transition: 'all 0.3s'
                            }}
                        />
                    ))}
                </div>

                {/* Slide Content */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-main)' }}>
                        {slide.title}
                    </h2>
                    <p style={{ fontSize: '1rem', color: 'var(--text-sub)', lineHeight: '1.6', marginBottom: '1rem' }}>
                        {slide.description}
                    </p>
                    <div style={{
                        background: '#FEF3C7',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.75rem',
                        fontSize: '0.9rem',
                        color: '#92400E'
                    }}>
                        💡 {slide.tip}
                    </div>
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        onClick={handlePrev}
                        disabled={currentSlide === 0}
                        style={{
                            background: currentSlide === 0 ? '#F1F5F9' : 'white',
                            border: '2px solid #E2E8F0',
                            borderRadius: '0.75rem',
                            padding: '0.75rem 1rem',
                            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: currentSlide === 0 ? '#CBD5E1' : '#64748B',
                            fontWeight: '600'
                        }}
                    >
                        <ChevronLeft size={18} /> 이전
                    </button>

                    <span style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>
                        {currentSlide + 1} / {tutorialSlides.length}
                    </span>

                    <button
                        onClick={handleNext}
                        style={{
                            background: 'var(--accent-blue)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            padding: '0.75rem 1.25rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: 'white',
                            fontWeight: '600'
                        }}
                    >
                        {currentSlide === tutorialSlides.length - 1 ? (
                            <><Sparkles size={18} /> 시작하기</>
                        ) : (
                            <>다음 <ChevronRight size={18} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorialModal;
