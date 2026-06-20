import { Action } from '../../types';

export const actionSplitterMiddleware = () => (next: (a: Action) => void) => (action: Action | Action[]): void => {
  if (Array.isArray(action)) {
    action.forEach((_action) => next(_action));
  } else {
    next(action);
  }
};
