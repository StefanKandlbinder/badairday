// feature name
export const STATIONS = '[Stations]';

// action types
export const FETCH_STATIONS = `${STATIONS} FETCH`;
export const SET_STATIONS = `${STATIONS} SET`;

// action creators
export const fetchStations = (url, provider) => ({
    type: FETCH_STATIONS,
    payload: url,
    meta: provider
});

export const setStations = ({ stations, normalizeKey }) => ({
    type: SET_STATIONS,
    payload: stations,
    meta: { normalizeKey, feature: STATIONS }
});