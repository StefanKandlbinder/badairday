export const getNotifiedStations = (stations) => {
    return stations.features.filter(stations => stations.properties.notify);
}