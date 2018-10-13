import { dataNormalized } from "../actions/data";
import { addStation } from "../actions/stations";

import Station from "../models/station";

export const normalizeUpperAustriaMiddleware = ({ dispatch }) => (next) => (action) => {
    const addStations = (stations, provider) => {
        stations.map(station => {
            let components = station.sensordatavalues.map(component => {
                return {
                    type: component.value_type === "P1" ? "P10" : "P25",
                    value: parseFloat(component.value)
                }
            });
            
            let stationModel = new Station(provider, 
                station.id,
                "Luftdatenstation: " + station.sensor.id,
                station.timestamp, 
                parseFloat(station.location.longitude),
                parseFloat(station.location.latitude),
                components,
                parseFloat(station.sensordatavalues[0].value));

            return dispatch(addStation({ station: stationModel, provider: provider }))
        })
    }

    console.log(action);

    // filter both by action type and metadata content
    if (action.type.includes('SET') && action.meta.provider === "luftdaten") {

        // notify about the transformation
        dispatch(dataNormalized({ feature: action.meta.feature }));

        // transform the data structure
        /* const stations = action.payload.reduce((acc, item) => {
            acc[item[action.meta.normalizeKey]] = item;
            return acc;
        }, {}); */

        next(addStations(action.payload, action.meta.provider));

        // fire the books document action
        // next(setStations({ stations, normalizeKey: null }));

    } else {
        next(action);
    }
};