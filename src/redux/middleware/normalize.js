import { dataNormalized } from "../actions/data";
import { addStation } from "../actions/stations";

import Station from "../models/station";

export const normalizeMiddleware = ({ dispatch }) => (next) => (action) => {
    const addStations = (stations, provider) => {
        stations.map(station => {
            let stationModel = new Station(provider, station.id, "", station.timestamp, station.location.longitude, station.location.latitude, station.sensordatavalues);

            return dispatch(addStation({ station: stationModel, provider: provider }))
        })
    }

    // filter both by action type and metadata content
    if (action.type.includes('SET') && action.meta.provider) {

        // notify about the transformation
        dispatch(dataNormalized({ feature: action.meta.feature }));

        // transform the data structure
        /* const stations = action.payload.reduce((acc, item) => {
            acc[item[action.meta.normalizeKey]] = item;
            return acc;
        }, {}); */

        next(addStations(action.payload, "luftdaten"));

        // fire the books document action
        // next(setStations({ stations, normalizeKey: null }));

    } else {
        next(action);
    }
};