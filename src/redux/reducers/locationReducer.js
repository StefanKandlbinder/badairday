import { SET_LOCATION } from "../actions/location";

const initState = {
    lat: 48.323368,
    lng: 14.298756
};

export const locationReducer = (location = initState, action) => {
    switch (action.type) {
        case SET_LOCATION:
            return { ...location, 
               lat: action.payload.lat,
               lng: action.payload.lng
            };

        default:
            return location;
    }
};