import { SET_OPTION_REVERSEGEO, SET_OPTION_AUTOUPDATING, SET_OPTION_RUNAWAYS, SET_OPTION_SORT } from "../actions/options";

const initState = {
    reversegeo: false,
    autoupdating: true,
    runaways: false,
    sort: true
};

export const optionsReducer = (options = initState, action) => {
    switch (true) {

        case action.type.includes(SET_OPTION_REVERSEGEO):
            return { ...options, reversegeo: action.payload };
        
        case action.type.includes(SET_OPTION_AUTOUPDATING):
            return { ...options, autoupdating: action.payload };
        
        case action.type.includes(SET_OPTION_RUNAWAYS):
            return { ...options, runaways: action.payload };

        case action.type.includes(SET_OPTION_SORT):
            return { ...options, sort: action.payload };

        default:
            return options;
    }
};