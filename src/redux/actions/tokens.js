// action types
export const SET_TOKEN_REVERSEGEO = 'SET_TOKEN_REVERSEGEO';

// action creators
export const setTokenReverseGeo = ({ state, feature }) => ({
    type: `${feature} ${SET_TOKEN_REVERSEGEO}`,
    payload: state,
    meta: { feature }
});