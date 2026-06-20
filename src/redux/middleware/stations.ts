import { Action } from '../../types';
import { STATIONS, FETCH_STATIONS, ADD_STATION, addStations, updateStations } from '../actions/stations';
import { setUpdate } from '../actions/update';
import { API_ERROR, API_SUCCESS, apiRequest } from '../actions/api';
import { setLoader, setUpdater } from '../actions/ui';
import { setNotification } from '../actions/notifications';
import getErrorMessage from '../../utilities/getErrorMessage';

export const stationsMiddleware = () => (next: (a: Action | Action[]) => void) => (action: Action): void => {
  next(action);

  const meta = action.meta as Record<string, unknown> | undefined;

  switch (action.type) {
    case FETCH_STATIONS + ' FETCH':
      next([
        apiRequest({ body: null, method: 'GET', url: action.payload as string, feature: STATIONS, provider: meta?.provider as string, update: meta?.method as string, location: meta?.location as never }),
        setLoader({ state: true, feature: STATIONS }),
      ]);
      break;

    case FETCH_STATIONS + ' UPDATE':
      next([
        apiRequest({ body: null, method: 'GET', url: action.payload as string, feature: STATIONS, provider: meta?.provider as string, update: meta?.method as string, location: meta?.location as never }),
        setUpdater({ state: true, feature: STATIONS }),
      ]);
      break;

    case ADD_STATION:
      next([]);
      break;

    case `${STATIONS} ${API_SUCCESS} FETCH`:
      next([
        addStations({ stations: action.payload, provider: meta?.provider as string, location: meta?.location as never }),
        setLoader({ state: false, feature: STATIONS }),
      ]);
      break;

    case `${STATIONS} ${API_SUCCESS} UPDATE`:
      next([
        updateStations({ stations: action.payload, provider: meta?.provider as string, location: meta?.location as never }),
        setUpdater({ state: false, feature: STATIONS }),
        setUpdate({ update: Date.now() }),
      ]);
      break;

    case `${STATIONS} ${API_ERROR}`:
      next([
        setNotification({ message: getErrorMessage((action.payload as { status?: number })?.status, meta?.provider as string), feature: STATIONS, type: 'error' }),
        setLoader({ state: false, feature: STATIONS }),
        setUpdater({ state: false, feature: STATIONS }),
      ]);
      break;

    default:
      break;
  }
};
