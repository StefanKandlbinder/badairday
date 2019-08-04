// action types
export const SET_LOADER = 'SET_LOADER';
export const SET_UPDATER = 'SET_UPDATER';
export const SET_GEOLOCATION = 'SET_GEOLOCATION';
export const SET_SIDEBAR = 'SET_SIDEBAR';
export const SET_BOTTOMSHEET = 'SET_BOTTOMSHEET';
export const SET_FAVBOARD = 'SET_FAVBOARD';
export const SET_NOTEBOARD = 'SET_NOTEBOARD';
export const SET_MEDIA = 'SET_MEDIA';

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

export const setBottomSheet = ({ state, feature }) => ({
    type: `${feature} ${SET_BOTTOMSHEET}`,
    payload: state, 
    meta: { feature }
});

export const setFavboard = ({ state, feature }) => ({
    type: `${feature} ${SET_FAVBOARD}`,
    payload: state,
    meta: { feature }
});

export const setNoteboard = ({ state, feature }) => ({
    type: `${feature} ${SET_NOTEBOARD}`,
    payload: state,
    meta: { feature }
});

export const setMedia = ({ state, feature }) => ({
    type: `${feature} ${SET_MEDIA}`,
    payload: state,
    meta: { feature }
});