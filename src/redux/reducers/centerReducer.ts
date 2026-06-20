import { CenterState, Station } from '../../types';
import { SET_CENTER } from '../actions/center';

const initState: CenterState = { lat: 48.323368, lng: 14.298756 };

interface Action { type: string; payload: unknown }

export const centerReducer = (center: CenterState = initState, action: Action): CenterState => {
  switch (action.type) {
    case SET_CENTER:
      return { ...center, station: action.payload as Station };
    default:
      return center;
  }
};
