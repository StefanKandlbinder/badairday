export const getStationByID = (stations, id) => {
    return stations.features.filter(stations => stations.properties.id === id)[0];
}