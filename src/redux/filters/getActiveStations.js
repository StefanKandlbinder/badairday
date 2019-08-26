export const getActiveStations = (stations) => {
    return stations.features.filter(stations => stations.properties.notify || stations.properties.favorized);
}