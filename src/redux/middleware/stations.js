import { STATIONS, FETCH_STATIONS, ADD_STATION, UPDATE_STATIONS, addStations } from "../actions/stations";
import { API_ERROR, API_SUCCESS, apiRequest } from "../actions/api";
import { setLoader } from "../actions/ui";
import { setNotification } from "../actions/notifications";

export const stationsMiddleware = () => (next) => (action) => {
    next(action);

    switch (action.type) {

        case FETCH_STATIONS:
            next([
                apiRequest({ body: null, method: 'GET', url: action.payload, feature: STATIONS, provider: action.meta.provider }),
                setLoader({ state: true, feature: STATIONS })
            ]);
            break;
        
        case UPDATE_STATIONS:
            console.log(action);
            next([
                apiRequest({ body: null, method: 'GET', url: action.payload, feature: STATIONS, provider: action.meta.provider }),
                setLoader({ state: true, feature: STATIONS })
            ]);
            break;
        
        case ADD_STATION:
            next([
                // setNotification({ message: action.payload.id, feature: STATIONS }),  
            ]);
            break;

        case `${STATIONS} ${API_SUCCESS}`:
            next([
                addStations({ stations: action.payload, provider: action.meta.provider }),
                setLoader({ state: false, feature: STATIONS })
            ]);
            break;

        case `${STATIONS} ${API_ERROR}`:
            console.log(action.payload);
            next([
                setNotification({ message: action.payload.message, feature: STATIONS }),
                setLoader({ state: false, feature: STATIONS })
            ]);
            break;
    }
};