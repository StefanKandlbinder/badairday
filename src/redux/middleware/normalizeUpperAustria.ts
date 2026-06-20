import { dataNormalized } from '../actions/data';
import { addStation, updateStation, ADD_STATIONS, UPDATE_STATIONS } from '../actions/stations';

import * as stationsObject from './stations.json';
import getStringDate from '../../utilities/getStringDate';

import createStation from '../models/station';
import createComponent from '../models/component';
import { Action, MiddlewareAPI, UpperAustriaMesswert, UpperAustriaResponse, StationComponents, StationEntry } from '../../types';

export const normalizeUpperAustriaMiddleware = ({ dispatch, getState }: MiddlewareAPI) => (next: (a: Action) => void) => (action: Action): void => {

  const latestEntries = (element: UpperAustriaMesswert[]): UpperAustriaMesswert[] => {
    const maxZeitpunkt = Math.max(...element.map((e) => e.zeitpunkt));
    return element.filter((e) => e.zeitpunkt === maxZeitpunkt);
  };

  const groupByStation = (items: UpperAustriaMesswert[]): Record<string, UpperAustriaMesswert[]> =>
    items.reduce<Record<string, UpperAustriaMesswert[]>>((acc, item) => {
      (acc[item.station] ??= []).push(item);
      return acc;
    }, {});

  const normalizeComponents = (element: UpperAustriaMesswert[]): StationComponents => {
    const components: StationComponents = {};
    let PM10 = false, PM25 = false, NO2 = false;

    element.forEach((component) => {
      let type = component.komponente;
      let value = 0;
      let unit = component.einheit;

      switch (component.komponente) {
        case 'PM10kont': type = 'PM10'; PM10 = true; break;
        case 'PM25kont': type = 'PM25'; PM25 = true; break;
        case 'NO2': NO2 = true; break;
      }

      switch (component.einheit) {
        case 'mg/m3':
          unit = 'µg/m³';
          value = parseFloat((parseFloat(component.messwert.replace(',', '.')) * 1000).toFixed(1));
          break;
        case 'm/s':
          unit = 'km/h';
          value = parseFloat((parseFloat(component.messwert.replace(',', '.')) * 3.6).toFixed(1));
          break;
        default:
          value = parseFloat(parseFloat(component.messwert.replace(',', '.')).toFixed(1));
      }

      components[type] = createComponent(type, value, unit, true);
    });

    if (!PM10) components['PM10'] = createComponent('PM10', 0, 'µg/m³', false);
    if (!PM25) components['PM25'] = createComponent('PM25', 0, 'µg/m³', false);
    if (!NO2) components['NO2'] = createComponent('NO2', 0, 'µg/m³', false);

    return components;
  };

  const getStations = (stations: UpperAustriaMesswert[], provider: string, update: boolean): void => {
    const filtered = stations.filter((el) => el.station.match('S') && el.mittelwert === 'HMW');
    const grouped = groupByStation(filtered);

    Object.values(grouped).forEach((element) => {
      const latest = latestEntries(element);
      (stationsObject.stationen as StationEntry[]).forEach((station) => {
        if (station.code !== latest[0].station) return;
        const components = normalizeComponents(latest);

        const stationModel = createStation(
          'Feature',
          { type: 'Point', coordinates: [station.geoBreite, station.geoLaenge, 0] },
          {
            provider,
            id: latest[0].station,
            name: station.kurzname,
            date: getStringDate(latest[0].zeitpunkt),
            components,
            mood: components.PM10?.value ?? 0,
            favorized: false,
            notify: false,
          }
        );

        const persisted = getState().stations.features;
        if (persisted.length) {
          if (persisted.find(s => s.properties.id === stationModel.properties.id) !== undefined) return;
          dispatch(addStation({ station: stationModel, provider }));
        } else if (!update) {
          dispatch(addStation({ station: stationModel, provider }));
        }
      });
    });
  };

  const updateStations = (stations: UpperAustriaMesswert[], provider: string): void => {
    if (!stations) return;
    const filtered = stations.filter((el) => el.station.match('S') && el.mittelwert === 'HMW');
    const grouped = groupByStation(filtered);

    Object.values(grouped).forEach((element) => {
      const latest = latestEntries(element);
      (stationsObject.stationen as StationEntry[]).forEach((station) => {
        if (station.code !== latest[0].station) return;
        const components = normalizeComponents(latest);

        const stationModel = createStation(
          'Feature',
          { type: 'Point', coordinates: [station.geoLaenge, station.geoBreite, 0] },
          {
            provider,
            id: latest[0].station,
            name: station.kurzname,
            date: getStringDate(latest[0].zeitpunkt),
            components,
            mood: components.PM10?.value ?? 0,
          }
        );

        const filteredStation = getState().stations.features.filter((s) => s.properties.id === stationModel.properties.id);
        if (filteredStation.length) {
          dispatch(updateStation({ station: stationModel, provider }));
        } else {
          getStations(stations, provider, true);
        }
      });
    });

    dispatch(dataNormalized({ feature: (action.meta as Record<string, string>).feature }));
  };

  const meta = action.meta as Record<string, unknown> | undefined;

  if (action.type.includes(ADD_STATIONS) && meta?.provider === 'upperaustria') {
    const payload = action.payload as UpperAustriaResponse;
    getStations(payload.messwerte, meta.provider as string, false);
    dispatch(dataNormalized({ feature: (action.meta as Record<string, string>).feature }));
  } else if (action.type.includes(UPDATE_STATIONS) && meta?.provider === 'upperaustria') {
    const payload = action.payload as UpperAustriaResponse;
    updateStations(payload.messwerte, meta.provider as string);
  } else {
    next(action);
  }
};
