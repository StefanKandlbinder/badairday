import { UpdateState } from '../../types';
import { SET_UPDATE } from '../actions/update';

const initState: UpdateState = { timestamp: Date.now() };

interface Action { type: string; payload: unknown }

export const updateReducer = (update: UpdateState = initState, action: Action): UpdateState => {
  switch (action.type) {
    case SET_UPDATE:
      return { ...update, timestamp: action.payload as number };
    default:
      return update;
  }
};
