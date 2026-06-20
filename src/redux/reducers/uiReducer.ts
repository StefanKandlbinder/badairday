import { UIState } from '../../types';
import {
  SET_LOADER, SET_UPDATER, SET_GEOLOCATION, SET_SIDEBAR,
  SET_BOTTOMSHEET, SET_FAVBOARD, SET_CLUSTERBOARD, SET_MEDIA,
} from '../actions/ui';

const initState: UIState = {
  loading: false,
  updating: false,
  updaterCount: 0,
  geolocation: false,
  sidebar: false,
  bottomsheet: false,
  favboard: false,
  clusterboard: false,
  media: 'small',
};

interface Action { type: string; payload: unknown }

export const uiReducer = (ui: UIState = initState, action: Action): UIState => {
  switch (true) {
    case action.type.includes(SET_LOADER):       return { ...ui, loading: action.payload as boolean };
    case action.type.includes(SET_UPDATER): {
      const count = (action.payload as boolean) ? ui.updaterCount + 1 : ui.updaterCount - 1;
      return { ...ui, updaterCount: count, updating: count !== 0 };
    }
    case action.type.includes(SET_GEOLOCATION):  return { ...ui, geolocation: action.payload as boolean };
    case action.type.includes(SET_SIDEBAR):      return { ...ui, sidebar: action.payload as boolean };
    case action.type.includes(SET_BOTTOMSHEET):  return { ...ui, bottomsheet: action.payload as boolean };
    case action.type.includes(SET_FAVBOARD):     return { ...ui, favboard: action.payload as boolean };
    case action.type.includes(SET_CLUSTERBOARD): return { ...ui, clusterboard: action.payload as boolean };
    case action.type.includes(SET_MEDIA):        return { ...ui, media: action.payload as string };
    default: return ui;
  }
};
