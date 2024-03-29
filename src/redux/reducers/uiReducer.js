import { 
    SET_LOADER, 
    SET_UPDATER, 
    SET_GEOLOCATION, 
    SET_SIDEBAR, 
    SET_BOTTOMSHEET, 
    SET_FAVBOARD,
    SET_CLUSTERBOARD,
    SET_MEDIA 
} from "../actions/ui";

const initState = {
    loading: false,
    updating: false,
    geolocation: false,
    sidebar: false,
    bottomsheet: false,
    favboard: false,
    clusterboard: false,
    media: {
        size: "small"
    }
};

let updateCount = 0;

let getCount = (payload) => {
    if (payload) {
        updateCount += 1;
    }
    else {
        updateCount -= 1;
    }

    return updateCount === 0 ? false : true
}

export const uiReducer = (ui = initState, action) => {
    switch (true) {

        case action.type.includes(SET_LOADER):
            return { ...ui, loading: action.payload };
        
        case action.type.includes(SET_UPDATER):
            return { ...ui, updating: getCount(action.payload) };
        
        case action.type.includes(SET_GEOLOCATION):
            return { ...ui, geolocation: action.payload };
        
        case action.type.includes(SET_SIDEBAR):
            return { ...ui, sidebar: action.payload };
        
        case action.type.includes(SET_BOTTOMSHEET):
            return { ...ui, bottomsheet: action.payload };
        
        case action.type.includes(SET_FAVBOARD):
            return { ...ui, favboard: action.payload };
        
        case action.type.includes(SET_CLUSTERBOARD):
            return { ...ui, clusterboard: action.payload };
        
        case action.type.includes(SET_MEDIA):
            return { ...ui, media: action.payload };

        default:
            return ui;
    }
};