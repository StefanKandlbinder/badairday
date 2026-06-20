import { Station } from '../../types';

export const SET_CENTER = 'SET_CENTER';

export const setCenter = (center: Station) => ({
  type: SET_CENTER,
  payload: center,
});
