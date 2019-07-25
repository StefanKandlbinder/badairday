import { 
    SET_STATIONS, 
    ADD_STATION, 
    UPDATE_STATION, 
    FAVORIZE_STATION, 
    UNFAVORIZE_STATION,
    NOTIFY_STATION, 
    UNNOTIFY_STATION } from "../actions/stations";

const initState = [];

export const stationsReducer = (stations = initState, action) => {
    switch (action.type) {

        case SET_STATIONS:
            return action.payload;

        case ADD_STATION:
            return [...stations, action.payload];

        case UPDATE_STATION:
            return stations.map((station) => {
                if (station.id === action.payload.id) {
                    return {
                        ...station, 
                        date: action.payload.date,
                        mood: action.payload.mood,
                        moodRGBA: action.payload.moodRGBA,
                        name: action.payload.name !== null ? action.payload.name : station.name,
                        components: {
                            ...station.components,
                            ...action.payload.components
                        }
                    }
                }
        
                // This isn't the item we care about - keep it as-is
                return station;        
            });
        
        case FAVORIZE_STATION:
            return stations.map((station) => {
                if (station.id === action.payload) {
                    return {
                        ...station,
                        favorized: true
                    }
                }
        
                return station;        
            });
        
        case UNFAVORIZE_STATION:
            return stations.map((station) => {
                if (station.id === action.payload) {
                    return {
                        ...station, 
                        favorized: false,
                    }
                }
        
                return station;        
            });
        
            case NOTIFY_STATION:
                return stations.map((station) => {
                    if (station.id === action.payload) {
                        return {
                            ...station,
                            notify: true
                        }
                    }
            
                    return station;        
                });
            
            case UNNOTIFY_STATION:
                return stations.map((station) => {
                    if (station.id === action.payload) {
                        return {
                            ...station, 
                            notify: false,
                        }
                    }
            
                    return station;        
                });

        default:
            return stations;
    }
}