import ReverseGeocode from 'esri-leaflet-geocoder';

import { dataNormalized } from '../actions/data';
import { ADD_STATIONS, UPDATE_STATIONS, STATIONS } from '../actions/stations';
import { addStation, updateStation, updateStationName } from '../reducers/stationsReducer';
import { setTokenReversegeo } from '../reducers/tokensReducer';
import getStringDateLuftdaten from '../../utilities/getStringDateLuftdaten';
import getUnixDateFromLuftdaten from '../../utilities/getUnixDateFromLuftdaten';
import getArcgisToken from '../../services/getArcgisToken';
import { isPointWithinRadius } from 'geolib';

import createStation from '../models/station';
import createComponent from '../models/component';
import { Action, MiddlewareAPI, LuftdatenStation, StationComponents } from '../../types';

const radius = 50000;

export const normalizeLuftdatenMiddleware = ({ dispatch, getState }: MiddlewareAPI) => (next: (a: Action) => void) => (action: Action): void => {

  const normalizeComponents = (sensordatavalues: { value_type: string; value: string }[]): StationComponents => {
    const components: StationComponents = {};
    sensordatavalues.forEach((component) => {
      const type = component.value_type === 'P1' ? 'PM10' : 'PM25';
      components[type] = createComponent(type, parseFloat(parseFloat(component.value).toFixed(1)), 'µg/m³');
    });
    return components;
  };

  const dedupeByStation = (stations: LuftdatenStation[]): LuftdatenStation[] => {
    const seen = new Set<number>();
    const result: LuftdatenStation[] = [];
    for (let i = stations.length - 1; i >= 0; i--) {
      if (!seen.has(stations[i].sensor.id)) {
        seen.add(stations[i].sensor.id);
        result.push(stations[i]);
      }
    }
    return result;
  };

  const getStations = (stations: LuftdatenStation[], provider: string, update: boolean): void => {
    const unique = dedupeByStation(stations);

    unique.forEach((station) => {
      const components = normalizeComponents(station.sensordatavalues);
      const name = 'Luftdatensensor: ' + station.sensor.id;

      const stationModel = createStation(
        'Feature',
        { type: 'Point', coordinates: [parseFloat(station.location.latitude), parseFloat(station.location.longitude), 0] },
        {
          provider,
          id: station.sensor.id.toString(),
          name,
          reverseGeoName: name,
          date: getStringDateLuftdaten(station.timestamp),
          components,
          mood: components.PM10?.value ?? 0,
          favorized: false,
          notify: false,
        }
      );

      const persisted = getState().stations.features;
      if (persisted.length) {
        if (persisted.find(s => s.properties.id === stationModel.properties.id) !== undefined || stationModel.properties.mood > 1900) return;
        dispatch(addStation(stationModel));
      } else if (!update) {
        dispatch(addStation(stationModel));
      }
    });
  };

  const updateStations = (stations: LuftdatenStation[], provider: string): void => {
    if (!stations) return;

    const unique = dedupeByStation(stations);

    const tokens = getState().tokens;
    if ((tokens.reversegeo.timestamp ?? 0) + 7200 > Date.now() || tokens.reversegeo.timestamp === undefined) {
      getArcgisToken()
        .then((res) => {
          dispatch(setTokenReversegeo({ token: res.access_token, timestamp: Date.now() }));
        })
        .catch(() => {});
    }

    unique.forEach((station) => {
      const components = normalizeComponents(station.sensordatavalues);

      const stationModel = createStation(
        'Feature',
        { type: 'Point', coordinates: [parseFloat(station.location.latitude), parseFloat(station.location.longitude), 0] },
        {
          provider,
          id: station.sensor.id.toString(),
          name: 'Luftdatensensor: ' + station.sensor.id,
          date: getStringDateLuftdaten(station.timestamp),
          components,
          mood: components.PM10?.value ?? 0,
          favorized: false,
          notify: false,
        }
      );

      const filtered = getState().stations.features.filter((s) => s.properties.id === station.sensor.id.toString());

      if (filtered.length) {
        if (
          getState().options.reversegeo &&
          ReverseGeocode !== undefined &&
          tokens.reversegeo.timestamp &&
          filtered[0].properties.reverseGeoName.includes('Luftdatensensor')
        ) {
          // @ts-expect-error esri-leaflet-geocoder typings require unnecessary args
          ReverseGeocode.geocodeService().reverse()
            .token(tokens.reversegeo.token ?? '')
            .latlng([station.location.latitude, station.location.longitude])
            .distance(10)
            .run((_error: unknown, result: { address: { ShortLabel: string } } | null) => {
              if (!result) return;
              const named = createStation(
                'Feature',
                { type: 'Point', coordinates: [parseFloat(station.location.latitude), parseFloat(station.location.longitude), 0] },
                {
                  provider,
                  id: station.sensor.id.toString(),
                  name: 'Luftdatensensor: ' + station.sensor.id,
                  reverseGeoName: result.address.ShortLabel,
                  date: getStringDateLuftdaten(station.timestamp),
                  components,
                  mood: components.PM10?.value ?? 0,
                  favorized: false,
                  notify: false,
                }
              );
              dispatch(updateStationName(named));
            });
        }

        if (getUnixDateFromLuftdaten(filtered[0].properties.date) < getUnixDateFromLuftdaten(stationModel.properties.date)) {
          dispatch(updateStation(stationModel));
        }
      } else {
        getStations(stations, provider, true);
      }
    });

    dispatch(dataNormalized({ feature: (action.meta as Record<string, string>).feature }));
  };

  const addStationsHandler = (stations: LuftdatenStation[], provider: string): void => {
    if (!stations) return;
    getStations(stations, provider, false);
    dispatch(dataNormalized({ feature: (action.meta as Record<string, string>).feature }));
  };

  const meta = action.meta as Record<string, unknown> | undefined;

  if (action.type.includes(ADD_STATIONS) && meta?.provider === 'luftdaten') {
    const location = meta.location as { latitude: number; longitude: number } | null;
    const filtered = (action.payload as LuftdatenStation[]).filter((s) =>
      location ? isPointWithinRadius(
        { latitude: s.location.latitude, longitude: s.location.longitude },
        location,
        radius
      ) : true
    );
    addStationsHandler(filtered, meta.provider as string);
  } else if (action.type.includes(UPDATE_STATIONS) && meta?.provider === 'luftdaten') {
    const location = meta.location as { latitude: number; longitude: number } | null;
    const filtered = (action.payload as LuftdatenStation[]).filter((s) =>
      location ? isPointWithinRadius(
        { latitude: s.location.latitude, longitude: s.location.longitude },
        location,
        radius
      ) : true
    );
    updateStations(filtered, meta.provider as string);
  } else {
    next(action);
  }
};
