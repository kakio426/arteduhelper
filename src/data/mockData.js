import step1 from '../assets/mock/step1.png';
import step2 from '../assets/mock/step2.png';
import step3 from '../assets/mock/step3.png';
import step4 from '../assets/mock/step4.png';

export const MOCK_CLASS_DATA = {
    videoUrl: 'https://www.youtube.com/watch?v=sqxYGkSKUM8',
    steps: [
        {
            id: 111,
            text: '준비물을 확인해요. (도안, 가위, 풀, 색연필, 사인펜)',
            imageUrl: step1
        },
        {
            id: 222,
            text: '회전목마 지붕을 알록달록하게 색칠하고 꾸며주세요.',
            imageUrl: step2
        },
        {
            id: 333,
            text: '말과 기둥 도안을 테두리에 맞춰 조심조심 오려주세요.',
            imageUrl: step3
        },
        {
            id: 444,
            text: '기둥에 말을 붙이고 지붕과 연결해서 멋진 회전목마를 완성해요!',
            imageUrl: step4
        }
    ],
    stepInterval: 15
};
