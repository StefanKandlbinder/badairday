export const getStationByID = (stations, id) => {
    return stations.filter(stations => stations.id === id)[0];
}