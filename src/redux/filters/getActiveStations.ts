import { Station, StationsCollection } from '../../types';

export const getActiveStations = (stations: StationsCollection): Station[] =>
  stations.features.filter((s) => s.properties.notify || s.properties.favorized);
