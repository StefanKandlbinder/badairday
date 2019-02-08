// import { DevTools } from '../ui/DevTool'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import throttle from 'lodash/throttle';

import { stationsReducer } from './reducers/stationsReducer';
import { loadState, saveState } from './localStorage';
import { stationsMiddleware } from './middleware/stations';
import { apiMiddleware } from './middleware/api';
import { uiReducer } from "./reducers/uiReducer";
import { updateReducer } from "./reducers/updateReducer";
import { locationReducer } from "./reducers/locationReducer";
import { optionsReducer } from "./reducers/optionsReducer";
import { tokensReducer } from "./reducers/tokensReducer";
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
        notifications: notificationsReducer,
        update: updateReducer,
        location: locationReducer,
        options: optionsReducer,
        tokens: tokensReducer
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
            ui: store.getState().ui,
            update: store.getState().update,
            location: store.getState().location,
            options: store.getState().options

        });
    }, 1000))

    return store;
}

export default configureStore;