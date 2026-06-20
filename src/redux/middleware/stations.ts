import { Action } from '../../types';
import { STATIONS, FETCH_STATIONS, addStations, updateStations } from '../actions/stations';
import { setUpdate } from '../reducers/updateReducer';
import { setLoading, setUpdating } from '../reducers/uiReducer';
import { addNotification } from '../reducers/notificationsReducer';
import { addStation } from '../reducers/stationsReducer';
import { API_ERROR, API_SUCCESS, apiRequest } from '../actions/api';
import getErrorMessage from '../../utilities/getErrorMessage';

export const stationsMiddleware = () => (next: (a: Action | Action[]) => void) => (action: Action): void => {
  next(action);

  const meta = action.meta as Record<string, unknown> | undefined;

  switch (action.type) {
    case FETCH_STATIONS + ' FETCH':
      next([
        apiRequest({ body: null, method: 'GET', url: action.payload as string, feature: STATIONS, provider: meta?.provider as string, update: meta?.method as string, location: meta?.location as never }),
        setLoading(true),
      ]);
      break;

    case FETCH_STATIONS + ' UPDATE':
      next([
        apiRequest({ body: null, method: 'GET', url: action.payload as string, feature: STATIONS, provider: meta?.provider as string, update: meta?.method as string, location: meta?.location as never }),
        setUpdating(true),
      ]);
      break;

    case addStation.type:
      next([]);
      break;

    case `${STATIONS} ${API_SUCCESS} FETCH`:
      next([
        addStations({ stations: action.payload, provider: meta?.provider as string, location: meta?.location as never }),
        setLoading(false),
      ]);
      break;

    case `${STATIONS} ${API_SUCCESS} UPDATE`:
      next([
        updateStations({ stations: action.payload, provider: meta?.provider as string, location: meta?.location as never }),
        setUpdating(false),
        setUpdate(Date.now()),
      ]);
      break;

    case `${STATIONS} ${API_ERROR}`:
      next([
        addNotification(getErrorMessage((action.payload as { status?: number })?.status, meta?.provider as string), 'error'),
        setLoading(false),
        setUpdating(false),
      ]);
      break;

    default:
      break;
  }
};
