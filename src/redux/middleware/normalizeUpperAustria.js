import groupBy from 'lodash/groupBy';
import find from 'lodash/find';

import { dataNormalized } from "../actions/data";
import { addStation, updateStation, ADD_STATIONS, UPDATE_STATIONS } from "../actions/stations";
import { setUpdate } from "../actions/update";

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
                            components.PM10 ? components.PM10.value : 0);

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
            dispatch(setUpdate({ update: Date.now() }));
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
                            components.PM10 ? components.PM10.value : 0);
                        
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
            dispatch(setUpdate({ update: Date.now() }));
        }
    }

    const normalizeComponents = (element) => {
        let components = {};
        let PM10 = false;
        let PM25 = false;
        let NO2 = false;

        element.forEach(component => {
            let type = component.komponente;
            let value = 0;
            let unit = component.einheit;
            let update = true;

            switch (component.komponente) {
                case "PM10kont":
                    type = "PM10";
                    PM10 = true;
                    break;

                case "PM25kont":
                    type = "PM25";
                    PM25 = true;
                    break;

                case "NO2":
                    NO2 = true;
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
                    unit = component.einheit;
                    value = parseFloat(component.messwert.replace(",", "."));
            }

            components[type] = new Component(type, value, unit, update);
        })

        // if there is no update available, set the components to 0
        if (!PM10) {
            components["PM10"] = new Component("PM10", 0, "µg/m³", false);
        }

        if (!PM25) {
            components["PM25"] = new Component("PM25", 0, "µg/m³", false);
        }

        if (!NO2) {
            components["NO2"] = new Component("NO2", 0, "µg/m³", false);
        }

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