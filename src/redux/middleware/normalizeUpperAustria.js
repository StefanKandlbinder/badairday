import groupBy from 'lodash/groupBy';
import find from 'lodash/find';

import { dataNormalized } from "../actions/data";
import { addStation, updateStation, ADD_STATIONS, UPDATE_STATIONS } from "../actions/stations";

import * as stationsObject from './stations.json';
import getStringDate from '../../utilities/getStringDate';

import Station from "../models/station";
import Component from "../models/component";

export const normalizeUpperAustriaMiddleware = ({ dispatch, getState }) => (next) => (action) => {

    const addStations = (stations, provider) => {
        let filteredStations = null;

        if (stations) {
            filteredStations = stations.filter(el => {
                return el.station.match("S") && el.mittelwert === "HMW";
            });

            filteredStations = groupBy(filteredStations, 'station');

            Object.values(filteredStations).forEach(element => {
                let mood = 0;

                mood = element.filter(filteredElement => {
                    return filteredElement.komponente === "PM10kont";
                });

                if (mood.length) {
                    mood = parseFloat((mood[0].messwert.replace(",", ".")) * 1000).toFixed(2);
                }

                stationsObject.stationen.forEach(station => {
                    if (station.code === element[0].station) {
                        let components = normalizeComponents(element);

                        let stationModel = new Station("upperaustria",
                            element[0].station,
                            station.kurzname,
                            getStringDate(element[0].zeitpunkt),
                            station.geoBreite,
                            station.geoLaenge,
                            components,
                            mood);

                        let persistedStations = getState().stations;

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
                    }
                })
            });

            // notify about the transformation
            dispatch(dataNormalized({ feature: action.meta.feature }));
        }
    }

    const updateStations = (stations, provider) => {
        let filteredStations = null;

        if (stations) {
            filteredStations = stations.filter(el => {
                return el.station.match("S") && el.mittelwert === "HMW";
            });

            filteredStations = groupBy(filteredStations, 'station');

            Object.values(filteredStations).forEach(element => {
                let mood = 0;

                mood = element.filter(filteredElement => {
                    return filteredElement.komponente === "PM10kont";
                });

                if (mood.length) {
                    mood = parseFloat((mood[0].messwert.replace(",", ".")) * 1000).toFixed(2);
                }

                stationsObject.stationen.forEach(station => {
                    if (station.code === element[0].station) {
                        let components = normalizeComponents(element);

                        let stationModel = new Station("upperaustria",
                            element[0].station,
                            station.kurzname,
                            getStringDate(element[0].zeitpunkt),
                            station.geoBreite,
                            station.geoLaenge,
                            components,
                            mood);

                        let filteredStation = getState().stations.filter(station => station.id === stationModel.id)

                        if (filteredStation.length) {
                            //if (getUnixDateFromLuftdaten(filteredStation[0].date) < getUnixDateFromLuftdaten(stationModel.date)) {
                                return dispatch(updateStation({ station: stationModel, provider: provider }))
                            //}
                            //else
                                //return false
                        }

                        else {
                            return false
                        }
                    }
                })
            });

            // notify about the transformation
            dispatch(dataNormalized({ feature: action.meta.feature }));
        }
    }

    const normalizeComponents = (element) => {
        let components = {};

        element.forEach(component => {
            let type = "";
            let value = 0;
            let unit = component.einheit;

            switch (component.komponente) {
                case "PM10kont":
                    type = "PM10";
                    break;

                case "PM25kont":
                    type = "PM25";
                    break;

                default:
                    type = component.komponente
            }

            switch (component.einheit) {
                case "mg/m3":
                    unit = "µg/m³";
                    value = parseFloat(component.messwert.replace(",", ".")) * 1000;
                    break;

                case "m/s":
                    unit = "km/h";
                    value = parseFloat(component.messwert.replace(",", ".")) * 3.6;
                    break;

                default:
                    unit = component.einheit
                    value = parseFloat(component.messwert.replace(",", "."));
            }

            components[type] = new Component(type, value, unit);
        })

        return components;
    }

    // filter both by action type and metadata content
    if (action.type.includes(ADD_STATIONS) && action.meta.provider === "upperaustria") {
        addStations(action.payload.messwerte, action.meta.provider);
    }
    else if (action.type.includes(UPDATE_STATIONS) && action.meta.provider === "upperaustria") {
        updateStations(action.payload.messwerte, action.meta.provider);
    }
    else {
        next(action);
    }
};