import { STATIONS, FETCH_STATIONS, ADD_STATION, UPDATE_STATIONS, addStations, updateStations } from "../actions/stations";
import { setUpdate } from "../actions/update";
import { API_ERROR, API_SUCCESS, apiRequest } from "../actions/api";
import { setLoader, setUpdater } from "../actions/ui";
import { setNotification } from "../actions/notifications";

export const stationsMiddleware = () => (next) => (action) => {
    next(action);

    switch (action.type) {

        case FETCH_STATIONS + " FETCH":
            next([
                apiRequest({ body: null, method: 'GET', url: action.payload, feature: STATIONS, provider: action.meta.provider, update: action.meta.method }),
                setLoader({ state: true, feature: STATIONS })
            ]);
            break;
        
        case FETCH_STATIONS + " UPDATE":
            next([
                apiRequest({ body: null, method: 'GET', url: action.payload, feature: STATIONS, provider: action.meta.provider, update: action.meta.method }),
                setUpdater({ state: true, feature: STATIONS })
            ]);
            break;
        
        case UPDATE_STATIONS  + " " + action.meta.method:
            next([
                apiRequest({ body: null, method: 'GET', url: action.payload, feature: STATIONS, provider: action.meta.provider, update: action.meta.method }),
                setUpdater({ state: true, feature: STATIONS })
            ]);
            break;
        
        case ADD_STATION:
            next([
                // setNotification({ message: action.payload.id, feature: STATIONS }),  
            ]);
            break;

        case `${STATIONS} ${API_SUCCESS} FETCH`:
            next([
                addStations({ stations: action.payload, provider: action.meta.provider }),
                setLoader({ state: false, feature: STATIONS })
            ]);
            break;
        
        case `${STATIONS} ${API_SUCCESS} UPDATE`:
            next([
                updateStations({ stations: action.payload, provider: action.meta.provider }),
                setUpdater({ state: false, feature: STATIONS }),
                setUpdate({ update: Date.now() })
            ]);
            break;

        case `${STATIONS} ${API_ERROR}`:
            let message = "Oh je, " + action.meta.provider;

            switch (action.payload.status) {
                case 400:
                case 403:
                case 404:
                case 405:
                    message += " ist leider gerade nicht erreichbar!"
                    break;
                default:
                    message += " ist leider gerade nicht erreichbar!";
                    break;
            }

            next([
                setNotification({ message: message, feature: STATIONS }),
                setLoader({ state: false, feature: STATIONS }),
                setUpdater({ state: false, feature: STATIONS })
            ]);
            break;
        
        default:
            break;
    }
};