import { Action } from '../../types';
import { SET_NOTIFICATION, setNotification } from '../actions/notifications';

export const notificationMiddleware = () => (next: (a: Action) => void) => (action: Action): void => {
  if (action.type.includes(SET_NOTIFICATION)) {
    const { payload, meta } = action;
    const id = new Date().getMilliseconds();
    const notification = { id, message: payload };
    next(setNotification({ message: notification, feature: (meta as Record<string, string>).feature, type: (meta as Record<string, string>).type }));
  } else {
    next(action);
  }
};
