import {
    SET_STATIONS,
    ADD_STATION,
    UPDATE_STATION,
    FAVORIZE_STATION,
    UNFAVORIZE_STATION,
    NOTIFY_STATION,
    UNNOTIFY_STATION
} from "../actions/stations";

const initState = {
    type: "FeatureCollection",
    features: []
};

let features = [];

export const stationsReducer = (stations = initState, action) => {
    switch (action.type) {

        case SET_STATIONS:
            return action.payload;

        case ADD_STATION: 
            return {
                ...stations,
                features:[
                    ...stations.features, action.payload
                ]
            }

        case UPDATE_STATION:
            features = stations.features.map((station) => {
                if (station.properties.id === action.payload.properties.id) {
                    return {
                        ...station,
                        properties: {
                            ...station.properties,
                            date: action.payload.properties.date,
                            mood: action.payload.properties.mood,
                            moodRGBA: action.payload.properties.moodRGBA,
                            name: action.payload.properties.name !== null ? action.payload.properties.name : station.properties.name,
                            components: {
                                ...station.properties.components,
                                ...action.payload.properties.components
                            }
                        }
                    }
                }

                // This isn't the item we care about - keep it as-is
                return station;
            });

            return {
                ...stations,
                features
            }

        case FAVORIZE_STATION:
            features = stations.features.map((station) => {
                if (station.properties.id === action.payload) {
                    return {
                        ...station,
                        properties: {
                            ...station.properties,
                            favorized: true
                        }
                    }
                }

                return station;
            });

            return {
                ...stations,
                features
            }

        case UNFAVORIZE_STATION:
                features = stations.features.map((station) => {
                    if (station.properties.id === action.payload) {
                        return {
                            ...station,
                            properties: {
                                ...station.properties,
                                favorized: false
                            }
                        }
                    }
    
                    return station;
                });
    
                return {
                    ...stations,
                    features
                }

        case NOTIFY_STATION:
                features = stations.features.map((station) => {
                    if (station.properties.id === action.payload) {
                        return {
                            ...station,
                            properties: {
                                ...station.properties,
                                notify: true
                            }
                        }
                    }
    
                    return station;
                });
    
                return {
                    ...stations,
                    features
                }

        case UNNOTIFY_STATION:
                features = stations.features.map((station) => {
                    if (station.properties.id === action.payload) {
                        return {
                            ...station,
                            properties: {
                                ...station.properties,
                                notify: false
                            }
                        }
                    }
    
                    return station;
                });
    
                return {
                    ...stations,
                    features
                }

        default:
            return stations;
    }
}