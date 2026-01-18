export const initialState = {
    videoUrl: '',
    steps: [], // { id: number, text: string }
    stepInterval: 10 // seconds
};

export const ACTIONS = {
    SET_VIDEO_URL: 'SET_VIDEO_URL',
    ADD_STEP: 'ADD_STEP',
    REMOVE_STEP: 'REMOVE_STEP',
    UPDATE_STEP: 'UPDATE_STEP',
    SET_INTERVAL: 'SET_INTERVAL',
    REPLACE_STEPS: 'REPLACE_STEPS'
};

export const classDataReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_VIDEO_URL:
            return { ...state, videoUrl: action.payload };

        case ACTIONS.ADD_STEP:
            // Allow empty temporarily while typing? No, ADD usually implies creating a new block.
            // But we might want to just add an empty block and let user type.
            // For now, let's keep logic: Add "New Step" or payload.
            const newId = Date.now();
            return {
                ...state,
                steps: [...state.steps, { id: newId, text: action.payload || '' }]
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

        case ACTIONS.SET_INTERVAL:
            return { ...state, stepInterval: Math.max(1, parseInt(action.payload) || 10) };

        case ACTIONS.REPLACE_STEPS:
            return { ...state, steps: action.payload };

        default:
            return state;
    }
};
