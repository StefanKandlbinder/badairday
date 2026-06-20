import { OptionsState } from '../../types';
import { SET_OPTION_REVERSEGEO, SET_OPTION_AUTOUPDATING, SET_OPTION_RUNAWAYS, SET_OPTION_SORT } from '../actions/options';

const initState: OptionsState = { reversegeo: false, autoupdating: false, runaways: false, sort: true };

interface Action { type: string; payload: unknown }

export const optionsReducer = (options: OptionsState = initState, action: Action): OptionsState => {
  switch (true) {
    case action.type.includes(SET_OPTION_REVERSEGEO):   return { ...options, reversegeo: action.payload as boolean };
    case action.type.includes(SET_OPTION_AUTOUPDATING): return { ...options, autoupdating: action.payload as boolean };
    case action.type.includes(SET_OPTION_RUNAWAYS):     return { ...options, runaways: action.payload as boolean };
    case action.type.includes(SET_OPTION_SORT):         return { ...options, sort: action.payload as boolean };
    default: return options;
  }
};
