import groupBy from 'lodash/groupBy';

import { dataNormalized } from "../actions/data";
import { addStation } from "../actions/stations";

import Station from "../models/station";
import * as stationsObject from './stations.json';
import getStringDate from '../../utilities/getStringDate';

export const normalizeUpperAustriaMiddleware = ({ dispatch }) => (next) => (action) => {

    const addStations = (stations, provider) => {
        let filteredStations = null;

        filteredStations = stations.filter(el => {
            return el.station.match("S") && el.mittelwert === "HMW";
        });

        filteredStations = groupBy(filteredStations, 'station');

        console.log(filteredStations);

        Object.values(filteredStations).forEach(element => {
            let mood = [];

            mood = element.filter(filteredElement => {
                return filteredElement.komponente === "PM10kont";
                console.log(mood);
            });

            if (mood.length) {
                mood = parseFloat(mood[0].messwert.replace(",", ".")) * 1000;
            }
            else {
                mood = 0;
            }

            stationsObject.stationen.forEach(station => {
                if (station.code === element[0].station) {
                    let stationModel = new Station("upperaustria",
                        element[0].station,
                        station.kurzname,
                        getStringDate(element[0].zeitpunkt),
                        station.geoBreite,
                        station.geoLaenge,
                        element,
                        mood);

                    return dispatch(addStation({ station: stationModel, provider: provider }))
                }
            })
        });
    }

    // filter both by action type and metadata content
    if (action.type.includes('SET') && action.meta.provider === "upperaustria") {
        dispatch(dataNormalized({ feature: action.meta.feature }));
        next(addStations(action.payload.messwerte, action.meta.provider));
    } else {
        next(action);
    }
};