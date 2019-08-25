import find from 'lodash/find';
import unionBy from 'lodash/unionBy';
import ReverseGeocode from 'esri-leaflet-geocoder';

import { dataNormalized } from "../actions/data";
import { addStation, updateStation, updateStationName, ADD_STATIONS, UPDATE_STATIONS, STATIONS } from "../actions/stations";
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
            // get the latest
            stations = unionBy(stations.reverse(), 'sensor.id');

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

                let stationModel = new Station(
                    "Feature",
                    { type: "Point",
                    coordinates: 
                        [parseFloat(station.location.latitude), parseFloat(station.location.longitude), 0]
                    },
                    {
                        provider: provider,
                        id: station.sensor.id.toString(),
                        name: "Luftdatensensor: " + station.sensor.id,
                        date: getStringDateLuftdaten(station.timestamp),
                        components: components,
                        mood: (components.PM10 ? components.PM10.value : 0),
                        moodRGBA: "rgba(70, 70, 70, 0.75)",
                    })

                let filteredStation = getState().stations.features.filter(station => station.properties.id === stationModel.properties.id)

                if (filteredStation.length) {
                    if (getState().options.reversegeo && 
                        ReverseGeocode !== undefined && 
                        getState().tokens.reversegeo.timestamp &&
                        filteredStation[0].properties.reverseGeoName.includes("Luftdatensensor")) {

                        ReverseGeocode.geocodeService().reverse()
                            .token(getState().tokens.reversegeo.token)
                            .latlng([station.location.latitude, station.location.longitude])
                            .distance(10)
                            .run(function (error, result) {
                                if (error) {
                                    // name = "Luftdatensensor: " + station.id;
                                    return false
                                }
                                if (result) {
                                    let stationModel = new Station(
                                        "Feature",
                                        { type: "Point",
                                        coordinates: 
                                            [parseFloat(station.location.latitude), parseFloat(station.location.longitude), 0]
                                        },
                                        {
                                            provider: provider,
                                            id: station.sensor.id.toString(),
                                            name: "Luftdatensensor: " + station.sensor.id,
                                            reverseGeoName: result.address.ShortLabel,
                                            date: getStringDateLuftdaten(station.timestamp),
                                            components: components,
                                            mood: (components.PM10 ? components.PM10.value : 0),
                                            moodRGBA: "rgba(70, 70, 70, 0.75)",
                                        })
        
                                    dispatch(updateStationName({ station: stationModel, provider: provider }))
                                }
                            });
                    }

                    if (getUnixDateFromLuftdaten(filteredStation[0].properties.date) < getUnixDateFromLuftdaten(stationModel.properties.date)) {
                        return dispatch(updateStation({ station: stationModel, provider: provider }))
                    }
                    else
                        return false
                }

                else {
                    // if there are new stations add them
                    getStations(stations, provider, true);
                    return false
                }
            })

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
        // get the latest
        stations = unionBy(stations.reverse(), 'sensor.id');

        stations.map(station => {
            let components = normalizeComponents(station.sensordatavalues);
            let name = "Luftdatensensor: " + station.sensor.id;

            let stationModel = new Station(
                "Feature",
                { type: "Point",
                coordinates: 
                    [parseFloat(station.location.latitude), parseFloat(station.location.longitude), 0]
                },
                {
                    provider: provider,
                    id: station.sensor.id.toString(),
                    name: name,
                    reverseGeoName: name,
                    date: getStringDateLuftdaten(station.timestamp),
                    components: components,
                    mood: (components.PM10 ? components.PM10.value : 0),
                    moodRGBA: "rgba(70, 70, 70, 0.75)",
                    marker: {},
                    favorized: false,
                    notify: false,
                })

            let persistedStations = getState().stations.features;

            if (persistedStations.length) {
                if (find(persistedStations, ['properties.id', stationModel.properties.id]) !== undefined || stationModel.properties.mood > 1900) {
                    return false
                }
                else {
                    dispatch(addStation({ station: stationModel, provider: provider }))
                }
            }
            
            else if (!update) {
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