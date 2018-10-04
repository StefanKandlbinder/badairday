import { STATIONS, FETCH_STATIONS, setStations } from "../actions/stations";
import { API_ERROR, API_SUCCESS, apiRequest } from "../actions/api";
import { setLoader } from "../actions/ui";
import { setNotification } from "../actions/notifications";

export const stationsMiddleware = () => (next) => (action) => {
    next(action);

    switch (action.type) {

        case FETCH_STATIONS:
            next([
                apiRequest({ body: null, method: 'GET', url: action.payload, feature: STATIONS }),
                setLoader({ state: true, feature: STATIONS })
            ]);
            break;

        case `${STATIONS} ${API_SUCCESS}`:
            next([
                setStations({ stations: action.payload, normalizeKey: 'id' }),
                setLoader({ state: false, feature: STATIONS })
            ]);
            break;

        case `${STATIONS} ${API_ERROR}`:
            next([
                setNotification({ message: action.payload.message, feature: STATIONS }),
                setLoader({ state: false, feature: STATIONS })
            ]);
            break;
    }
};