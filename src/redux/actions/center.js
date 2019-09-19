// action types
export const SET_CENTER = 'SET_CENTER';

// action creators
export const setCenter = (center) => ({
    type: `${SET_CENTER}`,
    payload: center
});