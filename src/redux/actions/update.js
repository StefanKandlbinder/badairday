// action types
export const SET_UPDATE = 'SET_UPDATE';

// action creators
export const setUpdate = ({ update }) => ({
    type: `${SET_UPDATE}`,
    payload: update
});