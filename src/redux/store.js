// import { DevTools } from '../ui/DevTool'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import throttle from 'lodash/throttle';

import { stationsReducer } from './reducers/stationsReducer';
import { loadState, saveState } from './localStorage';
import { stationsMiddleware } from './middleware/stations';
import { apiMiddleware } from './middleware/api';
import { uiReducer } from "./reducers/uiReducer";
import { updateReducer } from "./reducers/updateReducer";
import { notificationsReducer } from "./reducers/notificationsReducer";
import { normalizeLuftdatenMiddleware } from "./middleware/normalizeLuftdaten";
import { normalizeUpperAustriaMiddleware } from "./middleware/normalizeUpperAustria";
import { notificationMiddleware } from "./middleware/notifications";
// import { loggerMiddleware } from "./middleware/logger";
import { actionSplitterMiddleware } from "./middleware/actionSplitter";

const configureStore = () => {
    // shape the state structure
    const rootReducer = combineReducers({
        stations: stationsReducer,
        ui: uiReducer,
        notification: notificationsReducer,
        update: updateReducer
    });

    // create the feature middleware array
    const featureMiddleware = [
        stationsMiddleware
    ];

    // create the core middleware array
    const coreMiddleware = [
        actionSplitterMiddleware,
        apiMiddleware,
        normalizeLuftdatenMiddleware,
        normalizeUpperAustriaMiddleware,
        notificationMiddleware
    ];

    const options = {
        maxAge: 150
    }

    // compose the middleware with additional (optional) enhancers,
    // DevTools.instrument() will enable dev tools integration
    const enhancer = compose(
        applyMiddleware(...featureMiddleware, ...coreMiddleware)
    );

    const composeEnhancers = composeWithDevTools(options);

    const persistedState = loadState();

    const store = createStore(
        rootReducer,
        persistedState,
        composeEnhancers(
        enhancer
        // other store enhancers if any
    ));

    store.subscribe(throttle(() => {
        saveState({
            stations: store.getState().stations,
            favorizedStations: store.getState().favorizedStations
        });
    }, 1000))

    return store;
}

export default configureStore;