export const initialState = {
    videoUrl: '',
    steps: [], // { id: number, text: string, imageUrl: string | null }
    stepInterval: 10 // seconds
};

export const ACTIONS = {
    SET_VIDEO_URL: 'SET_VIDEO_URL',
    ADD_STEP: 'ADD_STEP',
    REMOVE_STEP: 'REMOVE_STEP',
    UPDATE_STEP: 'UPDATE_STEP',
    UPDATE_STEP_IMAGE: 'UPDATE_STEP_IMAGE',
    SET_INTERVAL: 'SET_INTERVAL',
    REPLACE_STEPS: 'REPLACE_STEPS'
};

export const classDataReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_VIDEO_URL:
            return { ...state, videoUrl: action.payload };

        case ACTIONS.ADD_STEP:
            const newId = Date.now();
            return {
                ...state,
                steps: [...state.steps, { id: newId, text: action.payload || '', imageUrl: null }]
            };

        case ACTIONS.REMOVE_STEP:
            return {
                ...state,
                steps: state.steps.filter((_, index) => index !== action.payload)
            };

        case ACTIONS.UPDATE_STEP:
            const { index, text } = action.payload;
            const newSteps = [...state.steps];
            if (newSteps[index]) {
                newSteps[index] = { ...newSteps[index], text };
            }
            return {
                ...state,
                steps: newSteps
            };

        case ACTIONS.UPDATE_STEP_IMAGE:
            const { index: imgIndex, imageUrl } = action.payload;
            const stepsWithImage = [...state.steps];
            if (stepsWithImage[imgIndex]) {
                stepsWithImage[imgIndex] = { ...stepsWithImage[imgIndex], imageUrl };
            }
            return {
                ...state,
                steps: stepsWithImage
            };

        case ACTIONS.SET_INTERVAL:
            return { ...state, stepInterval: Math.max(1, parseInt(action.payload) || 10) };

        case ACTIONS.REPLACE_STEPS:
            // Ensure all steps have imageUrl property
            const normalizedSteps = action.payload.map(step => ({
                ...step,
                imageUrl: step.imageUrl || null
            }));
            return { ...state, steps: normalizedSteps };

        default:
            return state;
    }
};
