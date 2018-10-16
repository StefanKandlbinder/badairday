import ReverseGeocode from 'esri-leaflet-geocoder';

import { dataNormalized } from "../actions/data";
import { addStation, ADD_STATIONS } from "../actions/stations";

import Station from "../models/station";

export const normalizeLuftdatenMiddleware = ({ dispatch }) => (next) => (action) => {
    const addStations = (stations, provider) => {
        stations.map(station => {
            let components = station.sensordatavalues.map(component => {
                return {
                    type: component.value_type === "P1" ? "PM10" : "PM25",
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

        // notify about the transformation
        dispatch(dataNormalized({ feature: action.meta.feature }));
    }

    // filter both by action type and metadata content
    if (action.type.includes(ADD_STATIONS) && action.meta.provider === "luftdaten") {
        addStations(action.payload, action.meta.provider);
    } else {
        next(action);
    }
};