export const getFavorizedStations = (stations) => {
    return stations.filter(stations => stations.favorized);
}