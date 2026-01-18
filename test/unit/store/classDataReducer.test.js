import { describe, it, expect } from 'vitest';
import { classDataReducer, initialState, ACTIONS } from '../../../src/store/classDataReducer';

describe('Class Data Reducer', () => {
    it('should update video URL', () => {
        const newState = classDataReducer(initialState, {
            type: ACTIONS.SET_VIDEO_URL,
            payload: 'https://youtu.be/abc'
        });
        expect(newState.videoUrl).toBe('https://youtu.be/abc');
    });

    it('should add a valid instruction step', () => {
        const newState = classDataReducer(initialState, {
            type: ACTIONS.ADD_STEP,
            payload: 'Step 1 description'
        });
        expect(newState.steps).toHaveLength(1);
        expect(newState.steps[0].text).toBe('Step 1 description');
    });

    it('should add empty instruction step', () => {
        const newState = classDataReducer(initialState, {
            type: ACTIONS.ADD_STEP,
            payload: ''
        });
        expect(newState.steps).toHaveLength(1);
    });

    it('should remove a step by index', () => {
        const stateWithSteps = {
            ...initialState,
            steps: [{ id: 1, text: 'Step 1' }, { id: 2, text: 'Step 2' }]
        };
        const newState = classDataReducer(stateWithSteps, {
            type: ACTIONS.REMOVE_STEP,
            payload: 0 // remove first item
        });
        expect(newState.steps).toHaveLength(1);
        expect(newState.steps[0].text).toBe('Step 2');
    });

    it('should update a step text', () => {
        const stateWithSteps = {
            ...initialState,
            steps: [{ id: 1, text: 'Old Text' }]
        };
        const newState = classDataReducer(stateWithSteps, {
            type: ACTIONS.UPDATE_STEP,
            payload: { index: 0, text: 'New Text' }
        });
        expect(newState.steps[0].text).toBe('New Text');
    });
});
