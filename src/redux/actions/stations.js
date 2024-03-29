// feature name
export const STATIONS = '[Stations]';
export const STATION = '[Station]';

// action types
export const FETCH_STATIONS = `${STATIONS} FETCH`;
export const SET_STATIONS = `${STATIONS} SET`;
export const ADD_STATION = `${STATION} ADD`;
export const ADD_STATIONS = `${STATIONS} ADD`;
export const UPDATE_STATIONS = `${STATIONS} UPDATE`;
export const UPDATE_STATION = `${STATION} UPDATE`;
export const UPDATE_STATION_NAME = `${STATION} UPDATE NAME`;
export const FAVORIZE_STATION = `${STATIONS} FAVORIZE`;
export const UNFAVORIZE_STATION = `${STATIONS} UNFAVORIZE`;
export const NOTIFY_STATION = `${STATIONS} NOTIFY`;
export const UNNOTIFY_STATION = `${STATIONS} UNNOTIFY`;

// action creators
export const fetchStations = (url, provider, method, location) => ({
    type: FETCH_STATIONS + " " + method,
    payload: url,
    meta: { feature: STATIONS, provider: provider, method: method, location:location }
});

export const setStations = ({ stations, provider }) => ({
    type: SET_STATIONS,
    payload: stations,
    meta: { feature: STATIONS, provider: provider }
});

export const addStations = ({ stations, provider, location }) => ({
    type: ADD_STATIONS,
    payload: stations,
    meta: { feature: STATIONS, provider: provider, location: location }
});

export const updateStations = ({ stations, provider, location }) => ({
    type: UPDATE_STATIONS,
    payload: stations,
    meta: { feature: STATIONS, provider: provider, location: location }
});

export const addStation = ({ station, provider }) => ({
    type: ADD_STATION,
    payload: station,
    meta: { feature: STATIONS, provider: provider }
});

export const updateStation = ({ station, provider }) => ({
    type: UPDATE_STATION,
    payload: station,
    meta: { feature: STATIONS, provider: provider }
});

export const updateStationName = ({ station, provider }) => ({
    type: UPDATE_STATION_NAME,
    payload: station,
    meta: { feature: STATIONS, provider: provider }
});

export const favorizeStation = (id) => ({
    type: FAVORIZE_STATION,
    payload: id,
    meta: { feature: STATIONS }
});

export const unfavorizeStation = (id) => ({
    type: UNFAVORIZE_STATION,
    payload: id,
    meta: { feature: STATIONS }
});

export const notifyStation = (id) => ({
    type: NOTIFY_STATION,
    payload: id,
    meta: { feature: STATIONS }
});

export const unnotifyStation = (id) => ({
    type: UNNOTIFY_STATION,
    payload: id,
    meta: { feature: STATIONS }
});