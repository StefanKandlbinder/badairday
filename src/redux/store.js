// import { DevTools } from '../ui/DevTool'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { stationsReducer } from './reducers/stationsReducer';
import { stationsMiddleware } from './middleware/stations';
import { apiMiddleware } from './middleware/api';
import { uiReducer } from "./reducers/uiReducer";
import { notificationsReducer } from "./reducers/notificationsReducer";
// import { normalizeMiddleware } from "./middleware/normalize";
import { notificationMiddleware } from "./middleware/notifications";
// import { loggerMiddleware } from "./middleware/logger";
import { actionSplitterMiddleware } from "./middleware/actionSplitter";

// shape the state structure
const rootReducer = combineReducers({
    stations: stationsReducer,
    ui: uiReducer,
    notification: notificationsReducer
});

// create the feature middleware array
const featureMiddleware = [
    stationsMiddleware
];

// create the core middleware array
const coreMiddleware = [
    actionSplitterMiddleware,
    apiMiddleware,
    // normalizeMiddleware,
    notificationMiddleware
];

// compose the middleware with additional (optional) enhancers,
// DevTools.instrument() will enable dev tools integration
const enhancer = compose(
    applyMiddleware(...featureMiddleware, ...coreMiddleware)
);

export const store = createStore(rootReducer, composeWithDevTools(
    enhancer
    // other store enhancers if any
));