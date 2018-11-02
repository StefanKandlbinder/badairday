import { SET_OPTION_REVERSEGEO, SET_OPTION_AUTOUPDATING, SET_OPTION_RUNAWAYS } from "../actions/options";

const initState = {
    reversegeo: true,
    autoupdating: false,
    runaways: false
};

export const optionsReducer = (options = initState, action) => {
    switch (true) {

        case action.type.includes(SET_OPTION_REVERSEGEO):
            return { ...options, reversegeo: action.payload };
        
        case action.type.includes(SET_OPTION_AUTOUPDATING):
            return { ...options, autoupdating: action.payload };
        
        case action.type.includes(SET_OPTION_RUNAWAYS):
            return { ...options, runaways: action.payload };

        default:
            return options;
    }
};