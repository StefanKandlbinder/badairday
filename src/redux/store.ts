import { configureStore } from '@reduxjs/toolkit';

import { stationsReducer } from './reducers/stationsReducer';
import { loadState, saveState } from './localStorage';
import { stationsMiddleware } from './middleware/stations';
import { apiMiddleware } from './middleware/api';
import { uiReducer } from './reducers/uiReducer';
import { updateReducer } from './reducers/updateReducer';
import { locationReducer } from './reducers/locationReducer';
import { centerReducer } from './reducers/centerReducer';
import { subscriptionReducer } from './reducers/subscriptionReducer';
import { optionsReducer } from './reducers/optionsReducer';
import { tokensReducer } from './reducers/tokensReducer';
import { notificationsReducer } from './reducers/notificationsReducer';
import { normalizeLuftdatenMiddleware } from './middleware/normalizeLuftdaten';
import { normalizeUpperAustriaMiddleware } from './middleware/normalizeUpperAustria';
import { notificationMiddleware } from './middleware/notifications';
import { actionSplitterMiddleware } from './middleware/actionSplitter';

const buildStore = () => {
  const persistedState = loadState();

  // Reset in-flight updater count that may have persisted after a crash
  if (persistedState?.ui) {
    persistedState.ui.updaterCount = 0;
    persistedState.ui.updating = false;
  }

  const middleware = [
    stationsMiddleware,
    actionSplitterMiddleware,
    apiMiddleware,
    normalizeLuftdatenMiddleware,
    normalizeUpperAustriaMiddleware,
    notificationMiddleware,
  ];

  const store = configureStore({
    reducer: {
      stations: stationsReducer,
      ui: uiReducer,
      notifications: notificationsReducer,
      update: updateReducer,
      location: locationReducer,
      center: centerReducer,
      subscription: subscriptionReducer,
      options: optionsReducer,
      tokens: tokensReducer,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    middleware: () => middleware as any,
    preloadedState: persistedState,
    devTools: { maxAge: 150 },
  });

  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  store.subscribe(() => {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
      saveTimer = null;
      const s = store.getState();
      saveState({
        stations: s.stations,
        ui: s.ui,
        update: s.update,
        location: s.location,
        options: s.options,
        subscription: s.subscription,
        tokens: s.tokens,
      });
    }, 1000);
  });

  return store;
};

export default buildStore;

export type AppStore = ReturnType<typeof buildStore>;
export type AppDispatch = AppStore['dispatch'];
