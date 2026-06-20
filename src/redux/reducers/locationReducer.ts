import { LatLng } from '../../types';
import { SET_LOCATION } from '../actions/location';

const initState: LatLng = { lat: 48.323368, lng: 14.298756 };

interface Action { type: string; payload: unknown }

export const locationReducer = (location: LatLng = initState, action: Action): LatLng => {
  switch (action.type) {
    case SET_LOCATION: {
      const loc = action.payload as LatLng;
      return { ...location, lat: loc.lat, lng: loc.lng };
    }
    default:
      return location;
  }
};
