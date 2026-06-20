import { LatLng } from '../../types';

export const SET_LOCATION = 'SET_LOCATION';

export const setLocation = (location: LatLng) => ({
  type: SET_LOCATION,
  payload: location,
});
