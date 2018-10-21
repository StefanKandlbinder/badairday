// import ReverseGeocode from 'esri-leaflet-geocoder';
import find from 'lodash/find';

import { dataNormalized } from "../actions/data";
import { addStation, updateStation, ADD_STATIONS, UPDATE_STATIONS } from "../actions/stations";
import getStringDateLuftdaten from '../../utilities/getStringDateLuftdaten';
import getUnixDateFromLuftdaten from '../../utilities/getUnixDateFromLuftdaten';

import Station from "../models/station";

export const normalizeLuftdatenMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    const addStations = (stations, provider) => {
        if (stations) {
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
                    station.sensor.id,
                    name,
                    getStringDateLuftdaten(station.timestamp), 
                    parseFloat(station.location.longitude),
                    parseFloat(station.location.latitude),
                    components,
                    parseFloat(station.sensordatavalues[0].value));
                
                let persistedStations = getState().stations;

                if (persistedStations.length) {
                    if (find(persistedStations, ['id', stationModel.id]) !== undefined) {
                        console.log(persistedStations);
                        return false
                    }
                    else {
                        dispatch(addStation({ station: stationModel, provider: provider }))
                    }
                }
                else {
                    return dispatch(addStation({ station: stationModel, provider: provider })) 
                }

                // return dispatch(addStation({ station: stationModel, provider: provider }))
                return false
            })

            // notify about the transformation
            dispatch(dataNormalized({ feature: action.meta.feature }));
        }
    }

    const updateStations = (stations, provider) => {
        if (stations) {
            stations.map(station => {
                let components = station.sensordatavalues.map(component => {
                    return {
                        type: component.value_type === "P1" ? "PM10" : "PM25",
                        value: parseFloat(component.value)
                    }
                });

                let name = {};
                
                let stationModel = new Station(provider, 
                    station.sensor.id,
                    name,
                    getStringDateLuftdaten(station.timestamp), 
                    parseFloat(station.location.longitude),
                    parseFloat(station.location.latitude),
                    components,
                    parseFloat(station.sensordatavalues[0].value));

                
                // console.log(getState().stations[0].id, stationModel.date);

                let filteredStation = getState().stations.filter(station => station.id === stationModel.id)

                if (filteredStation.length) {
                    if (getUnixDateFromLuftdaten(filteredStation[0].date) < getUnixDateFromLuftdaten(stationModel.date)) {
                        return dispatch(updateStation({ station: stationModel, provider: provider }))
                    }
                    else
                        return false
                }

                else {
                    return false
                }
            })

            // notify about the transformation
            dispatch(dataNormalized({ feature: action.meta.feature }));
        }
    }

    // filter both by action type and metadata content
    if (action.type.includes(ADD_STATIONS) && action.meta.provider === "luftdaten") {
        addStations(action.payload, action.meta.provider);
    }

    else if (action.type.includes(UPDATE_STATIONS) && action.meta.provider === "luftdaten") {
        updateStations(action.payload, action.meta.provider);
    } else {
        next(action);
    }
};