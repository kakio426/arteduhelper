import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateStepsWithAI = async (apiKey, videoUrl, transcript = "", title = "") => {
    if (!apiKey) throw new Error("API 키가 필요합니다.");
    if (!videoUrl) throw new Error("영상 URL이 필요합니다.");

    // 자막 데이터가 너무 짧거나 거의 없으면 Gemini를 호출하지 않고 빠른 실패 처리 (사용자 제안 반영)
    const isTranscriptEmpty = !transcript || transcript.trim().length < 20 || transcript.includes("(자동 자막 추출 실패");

    if (isTranscriptEmpty && !title) {
        throw new Error("LOW_INFO");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // 모델명을 정확히 사용자가 명령한 gemini-3-flash-preview로 고정합니다.
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
            당신은 유능한 미술 선생님입니다. 제공된 정보를 바탕으로 학생들이 따라 하기 좋은 '단계별 미술 수업 안내'를 만들어주세요.
            
            [비디오 정보]
            - 제목: ${title || '알 수 없음'}
            - 대본/설명: ${transcript || '자막 데이터 없음'}
            
            ※주의사항: 
            1. 제공된 '제목'과 '대본'을 바탕으로 분석하십시오.
            2. 자막에 구체적인 미술 활동(그리기, 만들기 등) 내용이 전혀 없다면, "요약할 수 있는 충분한 정보가 없습니다."라고 한 줄만 출력하세요.
            3. 절대 임의로 상상해서 답변하지 마십시오. 모르면 모른다고 답변하십시오.
            4. 학생들의 눈높이에 맞춰 쉽고 명확한 문장으로 작성하세요.
            5. 각 단계는 한 줄씩 문장만 출력하세요 (번호, 기호, 타임스탬프 금지).
            6. 서론이나 맺음말 없이 본론만 출력하세요.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text.includes("요약할 수 있는") || text.trim().length < 5) {
            throw new Error("LOW_INFO");
        }

        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    } catch (error) {
        if (error.message === "LOW_INFO") throw error;
        console.error("AI Generation Error:", error);
        throw error;
    }
};
