// feature name
export const STATIONS = '[Stations]';
export const STATION = '[Station]';

// action types
export const FETCH_STATIONS = `${STATIONS} FETCH`;
export const SET_STATIONS = `${STATIONS} SET`;
export const ADD_STATION = `${STATION} ADD`;
export const ADD_STATIONS = `${STATIONS} ADD`;

// action creators
export const fetchStations = (url, provider) => ({
    type: FETCH_STATIONS,
    payload: url,
    meta: { feature: STATIONS, provider: provider }
});

export const setStations = ({ stations, provider }) => ({
    type: SET_STATIONS,
    payload: stations,
    meta: { feature: STATIONS, provider: provider }
});

export const addStations = ({ stations, provider }) => ({
    type: ADD_STATIONS,
    payload: stations,
    meta: { feature: STATIONS, provider: provider }
});

export const addStation = ({ station, provider }) => ({
    type: ADD_STATION,
    payload: station,
    meta: { feature: STATIONS, provider: provider }
});