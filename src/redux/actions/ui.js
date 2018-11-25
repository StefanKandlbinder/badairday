// action types
export const SET_LOADER = 'SET_LOADER';
export const SET_UPDATER = 'SET_UPDATER';
export const SET_GEOLOCATION = 'SET_GEOLOCATION';
export const SET_SIDEBAR = 'SET_SIDEBAR';

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

export const setGeoLocation = ({ state, feature }) => ({
    type: `${feature} ${SET_GEOLOCATION}`,
    payload: state,
    meta: { feature }
});

export const setSidebar = ({ state, feature }) => ({
    type: `${feature} ${SET_SIDEBAR}`,
    payload: state,
    meta: { feature }
});