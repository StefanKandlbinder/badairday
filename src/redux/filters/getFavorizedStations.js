export const getFavorizedStations = (stations) => {
    return stations.features.filter(stations => stations.properties.favorized);
}