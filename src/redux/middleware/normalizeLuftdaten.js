import ReverseGeocode from 'esri-leaflet-geocoder';
import find from 'lodash/find';

import { dataNormalized } from "../actions/data";
import { addStation, updateStation, ADD_STATIONS, UPDATE_STATIONS } from "../actions/stations";
import getStringDateLuftdaten from '../../utilities/getStringDateLuftdaten';
import getUnixDateFromLuftdaten from '../../utilities/getUnixDateFromLuftdaten';

import Station from "../models/station";
import Component from "../models/component";

export const normalizeLuftdatenMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    const addStations = (stations, provider) => {
        if (stations) {
            stations.map(station => {
                let components = {};

                station.sensordatavalues.forEach(component => {
                    let type = component.value_type === "P1" ? "PM10" : "PM25";
                    
                    components[type] = new Component(type, parseFloat(component.value), "µg/m³");
                })

                let name = "Lufdatensensor: " + station.sensor.id;

                if (getState().options.reversegeo) {
                    ReverseGeocode.geocodeService().reverse()
                        .latlng([station.location.latitude, station.location.longitude])
                        .distance(10)
                        .run(function (error, result) {
                            if (error) {
                                name.value = "Luftdatensensor: " + station.id;
                            }
                            if (result) {
                                name = result.address.ShortLabel;
                                dispatch(updateStation({ station: stationModel, provider: provider }))
                            }
                            // console.log(element, result);
                        });
                }

                let stationModel = new Station(provider,
                    station.sensor.id,
                    name,
                    getStringDateLuftdaten(station.timestamp),
                    parseFloat(station.location.longitude),
                    parseFloat(station.location.latitude),
                    components,
                    parseFloat(station.sensordatavalues[0].value).toFixed(2));

                let persistedStations = getState().stations;

                console.log(stationModel);

                if (persistedStations.length) {
                    if (find(persistedStations, ['id', stationModel.id]) !== undefined) {
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
                // return dispatch(addStation({ station: stationModel, provider: provider }))
            })

            // notify about the transformation
            dispatch(dataNormalized({ feature: action.meta.feature }));
        }
    }

    const updateStations = (stations, provider) => {
        if (stations) {
            stations.map(station => {
                let components = {};

                station.sensordatavalues.forEach(component => {
                    let type = component.value_type === "P1" ? "PM10" : "PM25";
                    
                    components[type] = new Component(type, parseFloat(component.value), "µg/m³");
                })

                let name = null;

                let stationModel = new Station(provider,
                    station.sensor.id,
                    name,
                    getStringDateLuftdaten(station.timestamp),
                    parseFloat(station.location.longitude),
                    parseFloat(station.location.latitude),
                    components,
                    parseFloat(station.sensordatavalues[0].value).toFixed(2));


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