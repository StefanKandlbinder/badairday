import ReverseGeocode from 'esri-leaflet-geocoder';

import { dataNormalized } from "../actions/data";
import { addStation } from "../actions/stations";

import Station from "../models/station";

export const normalizeLuftdatenMiddleware = ({ dispatch }) => (next) => (action) => {
    const addStations = (stations, provider) => {
        stations.map(station => {
            let components = station.sensordatavalues.map(component => {
                return {
                    type: component.value_type === "P1" ? "P10" : "P25",
                    value: parseFloat(component.value)
                }
            });

            let name = {};

            /* ReverseGeocode.geocodeService().reverse()
                .latlng([station.location.latitude, station.location.longitude])
                .distance(10)
                .run(function (error, result) {
                    if (error) {
                        name.value = "Luftdatensensor: " + station.id;
                    }
                    if (result) {
                        name.value = result.address.ShortLabel;
                    }
                    // console.log(element, result);
                }); */
            
            let stationModel = new Station(provider, 
                station.id,
                name,
                station.timestamp, 
                parseFloat(station.location.longitude),
                parseFloat(station.location.latitude),
                components,
                parseFloat(station.sensordatavalues[0].value));

            return dispatch(addStation({ station: stationModel, provider: provider }))
        })
    }

    // filter both by action type and metadata content
    if (action.type.includes('SET') && action.meta.provider === "luftdaten") {
        // notify about the transformation
        dispatch(dataNormalized({ feature: action.meta.feature }));
        next(addStations(action.payload, action.meta.provider));
    } else {
        next(action);
    }
};