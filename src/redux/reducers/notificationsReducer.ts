import { Notification } from '../../types';
import { REMOVE_NOTIFICATION, SET_NOTIFICATION } from '../actions/notifications';

interface Action { type: string; payload: unknown }

export const notificationsReducer = (notifications: Notification[] = [], action: Action): Notification[] => {
  switch (true) {
    case action.type.includes(SET_NOTIFICATION):
      return [...notifications, action as unknown as Notification];
    case action.type.includes(REMOVE_NOTIFICATION):
      return notifications.filter((n) => n.payload.id !== action.payload);
    default:
      return notifications;
  }
};
