import groupBy from 'lodash/groupBy';

import { dataNormalized } from "../actions/data";
import { addStation, updateStation, ADD_STATIONS, UPDATE_STATIONS } from "../actions/stations";

import Station from "../models/station";
import * as stationsObject from './stations.json';
import getStringDate from '../../utilities/getStringDate';

export const normalizeUpperAustriaMiddleware = ({ dispatch }) => (next) => (action) => {

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
                        let stationModel = new Station("upperaustria",
                            element[0].station,
                            station.kurzname,
                            getStringDate(element[0].zeitpunkt + 3600000),
                            station.geoBreite,
                            station.geoLaenge,
                            element,
                            mood);

                        return dispatch(addStation({ station: stationModel, provider: provider }))
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
                        let stationModel = new Station("upperaustria",
                            element[0].station,
                            station.kurzname,
                            getStringDate(element[0].zeitpunkt + 3600000),
                            station.geoBreite,
                            station.geoLaenge,
                            element,
                            mood);

                        return dispatch(updateStation({ station: stationModel, provider: provider }))
                    }
                })
            });

            // notify about the transformation
            dispatch(dataNormalized({ feature: action.meta.feature }));
        }
    }

    // filter both by action type and metadata content
    if (action.type.includes(ADD_STATIONS) && action.meta.provider === "upperaustria") {
        addStations(action.payload.messwerte, action.meta.provider);
    }
    else if (action.type.includes(UPDATE_STATIONS) && action.meta.provider === "upperaustria") {
        console.log(action);
        updateStations(action.payload.messwerte, action.meta.provider);
    } 
    else {
        next(action);
    }
};