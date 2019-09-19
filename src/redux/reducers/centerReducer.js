import { SET_CENTER } from "../actions/center";

const initState = {
    lat: 48.323368,
    lng: 14.298756
};

export const centerReducer = (center = initState, action) => {
    switch (action.type) {
        case SET_CENTER:
            return { ...center, 
               station: action.payload
            };

        default:
            return center;
    }
};