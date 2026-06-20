import { Station, StationsCollection } from '../../types';

export const getNotifiedStations = (stations: StationsCollection): Station[] =>
  stations.features.filter((s) => s.properties.notify);
