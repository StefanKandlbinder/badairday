import { Station, StationsCollection } from '../../types';

export const getFavorizedStations = (stations: StationsCollection): Station[] =>
  stations.features.filter((s) => s.properties.favorized);
