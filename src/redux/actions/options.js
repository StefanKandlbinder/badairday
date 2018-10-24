// action types
export const SET_OPTION_REVERSEGEO = 'SET_OPTION_REVERSEGEO';
export const SET_OPTION_AUTOUPDATING = 'SET_OPTION_AUTOUPDATING';
export const SET_OPTION_RUNAWAYS = 'SET_OPTION_RUNAWAYS';

// action creators
export const setOptionReverseGeo = ({ state, feature }) => ({
    type: `${feature} ${SET_OPTION_REVERSEGEO}`,
    payload: state,
    meta: { feature }
});

export const setOptionAutoupdater = ({ state, feature }) => ({
    type: `${feature} ${SET_OPTION_AUTOUPDATING}`,
    payload: state,
    meta: { feature }
});

export const setOptionRunaways = ({ state, feature }) => ({
    type: `${feature} ${SET_OPTION_RUNAWAYS}`,
    payload: state,
    meta: { feature }
});