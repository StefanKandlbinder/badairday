import { Station, StationsCollection } from '../../types';
import {
  SET_STATIONS, ADD_STATION, UPDATE_STATION, UPDATE_STATION_NAME,
  FAVORIZE_STATION, UNFAVORIZE_STATION, NOTIFY_STATION, UNNOTIFY_STATION,
} from '../actions/stations';

const initState: StationsCollection = {
  type: 'FeatureCollection',
  features: [],
};

interface Action {
  type: string;
  payload: StationsCollection | Station | string;
}

export const stationsReducer = (stations: StationsCollection = initState, action: Action): StationsCollection => {
  switch (action.type) {
    case SET_STATIONS:
      return action.payload as StationsCollection;

    case ADD_STATION:
      return { ...stations, features: [...stations.features, action.payload as Station] };

    case UPDATE_STATION: {
      const updated = action.payload as Station;
      return {
        ...stations,
        features: stations.features.map((s) =>
          s.properties.id === updated.properties.id
            ? {
                ...s,
                properties: {
                  ...s.properties,
                  date: updated.properties.date,
                  mood: updated.properties.mood,
                  moodRGBA: updated.properties.moodRGBA,
                  name: updated.properties.name !== null ? updated.properties.name : s.properties.name,
                  components: { ...s.properties.components, ...updated.properties.components },
                },
              }
            : s
        ),
      };
    }

    case UPDATE_STATION_NAME: {
      const updated = action.payload as Station;
      return {
        ...stations,
        features: stations.features.map((s) =>
          s.properties.id === updated.properties.id
            ? {
                ...s,
                properties: {
                  ...s.properties,
                  reverseGeoName: updated.properties.reverseGeoName !== null
                    ? updated.properties.reverseGeoName
                    : s.properties.name,
                },
              }
            : s
        ),
      };
    }

    case FAVORIZE_STATION:
      return {
        ...stations,
        features: stations.features.map((s) =>
          s.properties.id === action.payload
            ? { ...s, properties: { ...s.properties, favorized: true } }
            : s
        ),
      };

    case UNFAVORIZE_STATION:
      return {
        ...stations,
        features: stations.features.map((s) =>
          s.properties.id === action.payload
            ? { ...s, properties: { ...s.properties, favorized: false } }
            : s
        ),
      };

    case NOTIFY_STATION:
      return {
        ...stations,
        features: stations.features.map((s) =>
          s.properties.id === action.payload
            ? { ...s, properties: { ...s.properties, notify: true } }
            : s
        ),
      };

    case UNNOTIFY_STATION:
      return {
        ...stations,
        features: stations.features.map((s) =>
          s.properties.id === action.payload
            ? { ...s, properties: { ...s.properties, notify: false } }
            : s
        ),
      };

    default:
      return stations;
  }
};
