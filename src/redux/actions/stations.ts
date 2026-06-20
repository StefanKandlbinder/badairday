import { Station, StationsCollection, LatLng } from '../../types';

export const STATIONS = '[Stations]';
export const STATION = '[Station]';

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

export const fetchStations = (url: string, provider: string, method: string, location: LatLng | null) => ({
  type: FETCH_STATIONS + ' ' + method,
  payload: url,
  meta: { feature: STATIONS, provider, method, location },
});

export const setStations = ({ stations, provider }: { stations: StationsCollection; provider: string }) => ({
  type: SET_STATIONS,
  payload: stations,
  meta: { feature: STATIONS, provider },
});

export const addStations = ({ stations, provider, location }: { stations: unknown; provider: string; location: LatLng | null }) => ({
  type: ADD_STATIONS,
  payload: stations,
  meta: { feature: STATIONS, provider, location },
});

export const updateStations = ({ stations, provider, location }: { stations: unknown; provider: string; location: LatLng | null }) => ({
  type: UPDATE_STATIONS,
  payload: stations,
  meta: { feature: STATIONS, provider, location },
});

export const addStation = ({ station, provider }: { station: Station; provider: string }) => ({
  type: ADD_STATION,
  payload: station,
  meta: { feature: STATIONS, provider },
});

export const updateStation = ({ station, provider }: { station: Station; provider: string }) => ({
  type: UPDATE_STATION,
  payload: station,
  meta: { feature: STATIONS, provider },
});

export const updateStationName = ({ station, provider }: { station: Station; provider: string }) => ({
  type: UPDATE_STATION_NAME,
  payload: station,
  meta: { feature: STATIONS, provider },
});

export const favorizeStation = (id: string) => ({
  type: FAVORIZE_STATION,
  payload: id,
  meta: { feature: STATIONS },
});

export const unfavorizeStation = (id: string) => ({
  type: UNFAVORIZE_STATION,
  payload: id,
  meta: { feature: STATIONS },
});

export const notifyStation = (id: string) => ({
  type: NOTIFY_STATION,
  payload: id,
  meta: { feature: STATIONS },
});

export const unnotifyStation = (id: string) => ({
  type: UNNOTIFY_STATION,
  payload: id,
  meta: { feature: STATIONS },
});
