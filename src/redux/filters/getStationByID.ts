import { Station, StationsCollection } from '../../types';

export const getStationByID = (stations: StationsCollection, id: string): Station | undefined =>
  stations.features.find((s) => s.properties.id === id);
