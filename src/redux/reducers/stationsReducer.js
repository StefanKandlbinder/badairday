import { SET_STATIONS, ADD_STATION, UPDATE_STATION } from "../actions/stations";
import { setNotification } from "../actions/notifications";

const initState = [];

export const stationsReducer = (stations = initState, action) => {
    switch (action.type) {

        case SET_STATIONS:
            return action.payload;

        case ADD_STATION:
            return [...stations, action.payload];

        case UPDATE_STATION:
            updateStation(stations, action.payload);

        default:
            return stations;
    }
};

function updateStation(stations, action) {

    return stations.map((station) => {
        if (station.id === action.id) {
            console.log(station, action);

            return {
                ...station,
                ...action.payload
            };
        }

        else {
            // This isn't the item we care about - keep it as-is
            return station;
        }
    });
}
