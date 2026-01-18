import React, { useState, useEffect } from 'react';
import { ACTIONS } from '../store/classDataReducer';
import { extractVideoId, getVideoInfo } from '../utils/youtubeParser';
import { cleanTranscript } from '../utils/transcriptParser';
import { generateStepsWithAI } from '../utils/aiService';
import VideoLooper from './VideoLooper';
import TutorialModal from './TutorialModal';
import { MOCK_CLASS_DATA } from '../data/mockData';
import {
    Sparkles,
    Plus,
    Trash2,
    Play,
    Info,
    Type,
    Video,
    Clock,
    X,
    FileText,
    ChevronRight,
    ImagePlus
} from 'lucide-react';

const SetupForm = ({ state, dispatch, onStart }) => {
    const [urlError, setUrlError] = useState('');
    const [transcriptText, setTranscriptText] = useState('');
    const [showImport, setShowImport] = useState(false);
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState('');
    const [showTutorial, setShowTutorial] = useState(false);

    // Extract video ID for preview
    const videoId = extractVideoId(state.videoUrl);

    useEffect(() => {
        localStorage.setItem('gemini_api_key', apiKey);
    }, [apiKey]);

    const handleUrlChange = (e) => {
        const url = e.target.value;
        dispatch({ type: ACTIONS.SET_VIDEO_URL, payload: url });

        if (url && !extractVideoId(url)) {
            setUrlError('유효하지 않은 YouTube URL입니다.');
        } else {
            setUrlError('');
        }
    };

    const handleIntervalChange = (e) => {
        dispatch({ type: ACTIONS.SET_INTERVAL, payload: e.target.value });
    };

    const handleAddStep = () => {
        dispatch({ type: ACTIONS.ADD_STEP, payload: '' });
    };

    const handleStepChange = (index, value) => {
        dispatch({ type: ACTIONS.UPDATE_STEP, payload: { index, text: value } });
    };

    const handleRemoveStep = (index) => {
        dispatch({ type: ACTIONS.REMOVE_STEP, payload: index });
    };

    const handleImageUpload = (index, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            dispatch({ type: ACTIONS.UPDATE_STEP_IMAGE, payload: { index, imageUrl: reader.result } });
        };
        reader.readAsDataURL(file);
    };

    const handlePaste = (index, event) => {
        const items = event.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                event.preventDefault();
                const file = items[i].getAsFile();
                if (file) {
                    handleImageUpload(index, file);
                }
                break;
            }
        }
    };

    const handleGenerateSteps = () => {
        if (!transcriptText.trim()) return;
        const steps = cleanTranscript(transcriptText);
        if (steps.length > 0) {
            dispatch({ type: ACTIONS.REPLACE_STEPS, payload: steps });
            setShowImport(false);
            setTranscriptText('');
        }
    };

    const handleDemoMode = () => {
        // Load mock video and settings
        dispatch({ type: ACTIONS.SET_VIDEO_URL, payload: MOCK_CLASS_DATA.videoUrl });
        dispatch({ type: ACTIONS.SET_INTERVAL, payload: MOCK_CLASS_DATA.stepInterval });
        dispatch({ type: ACTIONS.REPLACE_STEPS, payload: MOCK_CLASS_DATA.steps });

        // Show tutorial modal
        setShowTutorial(true);
    };

    const handleAIGenerate = async () => {
        if (!apiKey) {
            setAiError('Gemini API 키를 먼저 입력해주세요.');
            return;
        }
        if (!state.videoUrl || urlError) {
            setAiError('유효한 YouTube URL이 필요합니다.');
            return;
        }

        setIsGenerating(true);
        setAiError('');
        try {
            const { title, transcript: autoTranscript } = await getVideoInfo(state.videoUrl);
            const effectiveTranscript = transcriptText || autoTranscript;
            const steps = await generateStepsWithAI(apiKey, state.videoUrl, effectiveTranscript, title);

            const formattedSteps = steps.map((text, index) => ({
                id: Date.now() + index,
                text
            }));
            dispatch({ type: ACTIONS.REPLACE_STEPS, payload: formattedSteps });
        } catch (err) {
            if (err.message === "LOW_INFO") {
                setAiError('⚠️ 이 영상은 목소리 설명이 부족해 AI가 요약할 수 없습니다. 직접 단계를 입력해 주세요.');
            } else if (err.message.includes("429")) {
                setAiError('⚠️ API 할당량이 초과되었습니다. 잠시 후 다시 시도하거나 모델 설정을 확인해주세요.');
            } else {
                setAiError('AI 분석 중 오류가 발생했습니다: ' + err.message);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const isValid = state.videoUrl && !urlError && state.steps.length > 0 && state.steps.every(s => s.text.trim().length > 0);

    return (
        <div className="container" style={{ maxWidth: '900px', padding: '2rem 1rem' }}>
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', background: '#F0F9FF', borderRadius: '1.5rem', marginBottom: '1rem' }}>
                        <Sparkles size={40} color="var(--accent-blue)" />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)', letterSpacing: '-1px' }}>
                        Art Class Loop Assistant
                    </h1>
                    <p style={{ color: 'var(--text-sub)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        선생님을 위한 스마트 미술 수업 도우미
                    </p>
                    <button
                        onClick={handleDemoMode}
                        className="btn btn-secondary"
                        style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: '2rem',
                            fontSize: '0.95rem',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            border: '2px solid var(--accent-blue)',
                            color: 'var(--accent-blue)',
                            background: 'white'
                        }}
                    >
                        <Sparkles size={16} /> 기능 체험해보기
                    </button>
                </div>

                {/* API Key Section */}
                <div style={{
                    marginBottom: '2.5rem',
                    padding: '1.5rem',
                    background: 'rgba(56, 189, 248, 0.05)',
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(56, 189, 248, 0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.95rem' }}>
                            <Info size={18} color="var(--accent-blue)" /> Gemini API Key
                        </label>
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontSize: '0.85rem',
                                color: 'var(--accent-blue)',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                fontWeight: 'bold'
                            }}
                        >
                            키 발급받기 <ChevronRight size={14} />
                        </a>
                    </div>
                    <p style={{ marginTop: '-0.25rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.4' }}>
                        Google AI Studio에서 무료로 API 키를 발급받아 붙여넣어 주세요.<br />
                        (개인용 키를 사용하면 AI가 자동으로 수업 단계를 생성해줍니다!)
                    </p>
                    <input
                        type="password"
                        className="input-field"
                        placeholder="AI 기능을 사용하려면 API 키를 입력하세요"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '700' }}>
                            <Video size={18} color="var(--accent-blue)" /> YouTube Video URL
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={state.videoUrl}
                            onChange={handleUrlChange}
                        />
                        {urlError && <p style={{ color: '#EF4444', marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: '700' }}>{urlError}</p>}
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '700' }}>
                            <Clock size={18} color="var(--accent-blue)" /> 슬라이드 간격 (초)
                        </label>
                        <input
                            type="number"
                            className="input-field"
                            value={state.stepInterval}
                            onChange={handleIntervalChange}
                            min="1"
                        />
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleAIGenerate}
                        disabled={isGenerating}
                        style={{ width: '100%', maxWidth: '400px', height: '60px', fontSize: '1.1rem' }}
                    >
                        {isGenerating ? <div className="spinner"></div> : <><Sparkles size={20} /> AI로 수업 단계 자동 생성</>}
                    </button>
                    {aiError && <p style={{ color: '#EF4444', marginTop: '1rem', fontWeight: '700' }}>{aiError}</p>}
                </div>

                {/* AI Guide Section */}
                <div style={{
                    marginBottom: '3rem',
                    padding: '1.5rem',
                    borderRadius: '1.5rem',
                    background: 'var(--bg-color)',
                    borderLeft: '6px solid var(--accent-blue)',
                    fontSize: '0.95rem'
                }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--accent-blue)', fontSize: '1.1rem', fontWeight: '700' }}>
                        💡 수업 준비 팁
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <strong style={{ color: '#059669', display: 'block', marginBottom: '0.5rem' }}>✨ AI가 잘 분석해요</strong>
                            <ul style={{ margin: 0, padding: '0 0 0 1.25rem', color: 'var(--text-sub)' }}>
                                <li>선생님이 직접 설명하는 영상</li>
                                <li>정확한 자막이나 수업 안내가 있는 영상</li>
                            </ul>
                        </div>
                        <div>
                            <strong style={{ color: '#D97706', display: 'block', marginBottom: '0.5rem' }}>✏️ 직접 입력이 필요해요</strong>
                            <ul style={{ margin: 0, padding: '0 0 0 1.25rem', color: 'var(--text-sub)' }}>
                                <li>설명 없이 배경음악만 있는 영상</li>
                                <li>AI 결과가 정확하지 않을 때</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style={{
                    display: videoId ? 'grid' : 'block',
                    gridTemplateColumns: videoId ? '2fr 3fr' : '1fr',
                    gap: '2rem',
                    alignItems: 'start'
                }}>
                    {/* Left Side: Video Preview (Mobile handles this with stacked layout) */}
                    {videoId && (
                        <div style={{
                            position: 'sticky',
                            top: '100px',
                            zIndex: 10,
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            border: '4px solid white'
                        }}>
                            <div style={{ aspectRatio: '16/9', background: '#000' }}>
                                <VideoLooper videoId={videoId} />
                            </div>
                            <div style={{ padding: '1rem', background: 'white', fontSize: '0.85rem', color: 'var(--text-sub)', textAlign: 'center' }}>
                                📺 영상을 보며 아래 단계를 직접 수정할 수 있습니다.
                            </div>
                        </div>
                    )}

                    {/* Right Side: Instructions List */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>수업 단계 설정</h2>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button className="btn btn-secondary" onClick={() => setShowImport(!showImport)} style={{ whiteSpace: 'nowrap' }}>
                                    {showImport ? <><X size={16} /> 닫기</> : <><FileText size={16} /> 대본</>}
                                </button>
                                <button className="btn btn-primary" onClick={handleAddStep} style={{ whiteSpace: 'nowrap' }}>
                                    <Plus size={16} /> 추가
                                </button>
                            </div>
                        </div>

                        {showImport && (
                            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', borderRadius: '1.5rem', border: '2px dashed var(--accent-blue)' }}>
                                <p style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--text-sub)' }}>
                                    YouTube 영상 설명이나 자막을 붙여넣으세요. 타임스탬프는 자동으로 제거됩니다.
                                </p>
                                <textarea
                                    className="input-field"
                                    rows={5}
                                    placeholder="예:&#10;[00:00] 안녕하세요&#10;[00:10] 오늘은 동그라미를 그려볼게요"
                                    value={transcriptText}
                                    onChange={(e) => setTranscriptText(e.target.value)}
                                    style={{ marginBottom: '1rem' }}
                                />
                                <div style={{ textAlign: 'right' }}>
                                    <button className="btn btn-primary" onClick={handleGenerateSteps}>
                                        단계 생성하기
                                    </button>
                                </div>
                            </div>
                        )}

                        {state.steps.length === 0 && !showImport && (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed #E2E8F0', borderRadius: '2rem', background: '#F8FAFC' }}>
                                <Plus size={40} color="#CBD5E1" style={{ marginBottom: '1rem' }} />
                                <p style={{ color: '#94A3B8', fontSize: '1.1rem' }}>
                                    수업 단계를 구성해주세요.<br />AI 기능을 사용하거나 수동으로 추가할 수 있습니다.
                                </p>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {state.steps.map((step, index) => (
                                <div key={step.id} style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    alignItems: 'flex-start',
                                    background: 'white',
                                    padding: '1rem',
                                    borderRadius: '1rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{
                                        flexShrink: 0,
                                        width: '2rem',
                                        height: '2rem',
                                        background: 'var(--accent-blue)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '0.85rem'
                                    }}>
                                        {index + 1}
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <textarea
                                            className="input-field"
                                            value={step.text}
                                            onChange={(e) => handleStepChange(index, e.target.value)}
                                            onPaste={(e) => handlePaste(index, e)}
                                            placeholder={`단계 ${index + 1} 설명 입력... (이미지 붙여넣기 가능)`}
                                            rows={2}
                                            style={{ resize: 'none', margin: 0 }}
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <label style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                padding: '0.5rem 0.75rem',
                                                background: step.imageUrl ? '#E0F2FE' : '#F1F5F9',
                                                borderRadius: '0.5rem',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                color: step.imageUrl ? 'var(--accent-blue)' : '#64748B',
                                                transition: 'all 0.2s'
                                            }}>
                                                <ImagePlus size={14} />
                                                {step.imageUrl ? '이미지 변경' : '이미지 추가'}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                            {step.imageUrl && (
                                                <img
                                                    src={step.imageUrl}
                                                    alt={`Step ${index + 1}`}
                                                    style={{
                                                        height: '40px',
                                                        width: '60px',
                                                        objectFit: 'cover',
                                                        borderRadius: '0.25rem',
                                                        border: '1px solid #E2E8F0'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleRemoveStep(index)}
                                        style={{ padding: '0.5rem', flexShrink: 0 }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '4rem', paddingBottom: '2rem' }}>
                    <button
                        className="btn btn-primary"
                        style={{
                            fontSize: '1.25rem',
                            padding: '1.25rem 4rem',
                            background: 'var(--accent-pink)',
                            opacity: isValid ? 1 : 0.5,
                            cursor: isValid ? 'pointer' : 'not-allowed'
                        }}
                        disabled={!isValid}
                        onClick={onStart}
                    >
                        수업 시작하기 ▶
                    </button>
                </div>
            </div>

            {/* Tutorial Modal */}
            <TutorialModal
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
            />
        </div>
    );
};

export default SetupForm;
