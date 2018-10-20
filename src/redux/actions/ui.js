// action types
export const SET_LOADER = 'SET_LOADER';
export const SET_UPDATER = 'SET_UPDATER';

// action creators
export const setLoader = ({ state, feature }) => ({
    type: `${feature} ${SET_LOADER}`,
    payload: state,
    meta: { feature }
});

export const setUpdater = ({ state, feature }) => ({
    type: `${feature} ${SET_UPDATER}`,
    payload: state,
    meta: { feature }
});