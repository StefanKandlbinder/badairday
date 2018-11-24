import { SET_LOADER, SET_UPDATER, SET_GEOLOCATION } from "../actions/ui";

const initState = {
    loading: false,
    updating: false,
    geolocation: false
};

export const uiReducer = (ui = initState, action) => {
    switch (true) {

        case action.type.includes(SET_LOADER):
            return { ...ui, loading: action.payload };
        
        case action.type.includes(SET_UPDATER):
            return { ...ui, updating: action.payload };
        
        case action.type.includes(SET_GEOLOCATION):
            return { ...ui, geolocation: action.payload };

        default:
            return ui;
    }
};