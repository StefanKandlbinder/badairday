import find from 'lodash/find';

import { dataNormalized } from "../actions/data";
import { addStation, updateStation, ADD_STATIONS, UPDATE_STATIONS, STATIONS } from "../actions/stations";
import { setTokenReverseGeo } from "../actions/tokens";
import getStringDateLuftdaten from '../../utilities/getStringDateLuftdaten';
import getUnixDateFromLuftdaten from '../../utilities/getUnixDateFromLuftdaten';
import getArcgisToken from '../../services/getArcgisToken';

import Station from "../models/station";
import Component from "../models/component";

export const normalizeLuftdatenMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    const addStations = (stations, provider) => {
        if (stations) {
            getStations(stations, provider, false);

            // notify about the transformation
            dispatch(dataNormalized({ feature: action.meta.feature }));
        }
    }

    const updateStations = (stations, provider) => {
        if (stations) {
            stations.map(station => {
                let components = normalizeComponents(station.sensordatavalues);
                let name = null;

                let stationModel = new Station(provider,
                    station.sensor.id.toString(),
                    name,
                    getStringDateLuftdaten(station.timestamp),
                    parseFloat(station.location.latitude),
                    parseFloat(station.location.longitude),
                    components,
                    components.PM10 ? components.PM10.value : 0)

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

            // if there are new stations add them
            getStations(stations, provider, true);

            // notify about the transformation
            dispatch(dataNormalized({ feature: action.meta.feature }));
        }
    }

    const normalizeComponents = (element) => {
        let components = {};

        element.forEach(component => {
            let type = component.value_type === "P1" ? "PM10" : "PM25";

            components[type] = new Component(type, parseFloat(component.value), "µg/m³");
        });

        return components;
    }

    const getStations = (stations, provider, update) => {
        // console.log(getState().tokens.reversegeo.timestamp);

        if (getState().tokens.reversegeo.timestamp + 7200 > Date.now() || getState().tokens.reversegeo.timestamp === undefined) {
            getArcgisToken()
                .then((res) => {
                    let token = {
                        token: res.access_token,
                        timestamp: Date.now()
                    };

                    dispatch(setTokenReverseGeo({ state: token, feature: STATIONS }));
                })
                .catch((err) => {
                    // token = "";
                });
        }

        stations.map(station => {
            let components = normalizeComponents(station.sensordatavalues);
            let name = "Lufdatensensor: " + station.sensor.id;

            if (getState().options.reversegeo && getState().tokens.reversegeo.timestamp) {
                fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?outSr=4326&returnIntersection=false&location=${this.location.longitude},${this.location.latitude}&distance=10&token=${getState().tokens.reversegeo.token}&f=json`)
                    .then(res => {
                        if (res.status !== 200) {
                            name = "Luftdatensensor: " + station.id;
                        }
                        console.log("FETCH");
                        
                        return res.json();
                    })
                    .then(parsedRes => {
                        name = parsedRes.address.ShortLabel;

                        let stationModel = new Station(provider,
                            station.sensor.id.toString(),
                            name,
                            getStringDateLuftdaten(station.timestamp),
                            parseFloat(station.location.latitude),
                            parseFloat(station.location.longitude),
                            components,
                            components.PM10 ? parseFloat(components.PM10.value) : 0);

                        dispatch(updateStation({ station: stationModel, provider: provider }))
                    })
                    .catch(err => {
                        name = "Luftdatensensor: " + station.id;
                    });
            }

            let stationModel = new Station(provider,
                station.sensor.id.toString(),
                name,
                getStringDateLuftdaten(station.timestamp),
                parseFloat(station.location.latitude),
                parseFloat(station.location.longitude),
                components,
                components.PM10 ? components.PM10.value : 0)

            let persistedStations = getState().stations;

            if (persistedStations.length) {
                if (find(persistedStations, ['id', stationModel.id]) !== undefined || stationModel.mood > 1900) {
                    return false
                }
                else {
                    dispatch(addStation({ station: stationModel, provider: provider }))
                }
            }

            else if (update === false && stationModel.mood < 1900) {
                return dispatch(addStation({ station: stationModel, provider: provider }))
            }

            // return dispatch(addStation({ station: stationModel, provider: provider }))
            return false
            // return dispatch(addStation({ station: stationModel, provider: provider }))
        })
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