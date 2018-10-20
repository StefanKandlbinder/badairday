// action types
export const SET_UPDATE = 'SET_UPDATE';

// action creators
export const setUpdate = ({ state, feature }) => ({
    type: `${feature} ${SET_UPDATE}`,
    payload: state,
    meta: { feature }
});