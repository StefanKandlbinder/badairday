import { SET_STATIONS, ADD_STATION, UPDATE_STATIONS } from "../actions/stations";

const initState = [];

export const stationsReducer = (stations = initState, action) => {
    switch (action.type) {

        case SET_STATIONS:
            return action.payload;

        case ADD_STATION:
            return [...stations, action.payload];
        
        case UPDATE_STATIONS:
            return [];

        default:
            return stations;
    }
};