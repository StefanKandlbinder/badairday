import { 
    SET_LOADER, 
    SET_UPDATER, 
    SET_GEOLOCATION, 
    SET_SIDEBAR, 
    SET_BOTTOMSHEET, 
    SET_FAVBOARD,
    SET_NOTEBOARD,
    SET_MEDIA 
} from "../actions/ui";

const initState = {
    loading: false,
    updating: false,
    geolocation: false,
    sidebar: false,
    bottomsheet: false,
    favboard: false,
    noteboard: false,
    media: {
        size: "small"
    }
};

export const uiReducer = (ui = initState, action) => {
    switch (true) {

        case action.type.includes(SET_LOADER):
            return { ...ui, loading: action.payload };
        
        case action.type.includes(SET_UPDATER):
            return { ...ui, updating: action.payload };
        
        case action.type.includes(SET_GEOLOCATION):
            return { ...ui, geolocation: action.payload };
        
        case action.type.includes(SET_SIDEBAR):
            return { ...ui, sidebar: action.payload };
        
        case action.type.includes(SET_BOTTOMSHEET):
            return { ...ui, bottomsheet: action.payload };
        
        case action.type.includes(SET_FAVBOARD):
            return { ...ui, favboard: action.payload };
        
        case action.type.includes(SET_NOTEBOARD):
            return { ...ui, noteboard: action.payload };
        
        case action.type.includes(SET_MEDIA):
            return { ...ui, media: action.payload };

        default:
            return ui;
    }
};