export const getNotifiedStations = (stations) => {
    let notifiedStations =  stations.filter(stations => stations.notify);

    const simpleNotifiedStations =notifiedStations.map(item => {
        let temp = {
            id: item.id,
            provider: item.provider,
            name: item.name
        }

        return temp;
    })

    return simpleNotifiedStations;
}