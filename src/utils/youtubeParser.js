import { YoutubeTranscript } from 'youtube-transcript';

export const extractVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
};

export const getVideoInfo = async (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) return { title: '', transcript: '' };

    let title = '';
    let transcript = '';

    try {
        // Fetch Title via oEmbed (CORS friendly)
        const response = await fetch(`https://noembed.com/embed?url=${url}`);
        const data = await response.json();
        title = data.title || '';
    } catch (e) {
        console.error("Failed to fetch title:", e);
    }

    try {
        // Fetch Transcript
        // Note: This often requires a proxy or server-side in real browser apps due to CORS.
        // But we attempt it for environment check.
        const transcriptData = await YoutubeTranscript.fetchTranscript(url);
        transcript = transcriptData.map(t => t.text).join(' ');
    } catch (e) {
        console.warn("Failed to fetch transcript (CORS limit likely):", e);
        transcript = "(자동 자막 추출 실패 - 서비스 제한)";
    }

    return { title, transcript };
};

