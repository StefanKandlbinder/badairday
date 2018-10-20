import { SET_LOADER } from "../actions/ui";
import { SET_UPDATER } from "../actions/ui";

const initState = {
    loading: false,
    updating: false
};

export const uiReducer = (ui = initState, action) => {
    switch (true) {

        case action.type.includes(SET_LOADER):
            return { ...ui, loading: action.payload };
        
        case action.type.includes(SET_UPDATER):
            return { ...ui, updating: action.payload };

        default:
            return ui;
    }
};