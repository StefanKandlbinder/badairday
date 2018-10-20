import { SET_STATIONS, ADD_STATION, UPDATE_STATION } from "../actions/stations";

const initState = [];

export const stationsReducer = (stations = initState, action) => {
    switch (action.type) {

        case SET_STATIONS:
            return action.payload;

        case ADD_STATION:
            return [...stations, action.payload];

        case UPDATE_STATION:
            // console.log(stations, action);

            return stations.map((station) => {
                if (station.id === action.payload.id) {
                    return {
                        ...station, 
                        date: action.payload.date,
                        ...action.payload.components,
                        mood: action.payload.mood
                    }
                }
        
                // This isn't the item we care about - keep it as-is
                return station;        
            });

        default:
            return stations;
    }
}