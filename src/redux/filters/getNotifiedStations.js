export const getNotifiedStations = (stations) => {
    return stations.filter(stations => stations.notify);
}