import { REMOVE_NOTIFICATION, SET_NOTIFICATION } from "../actions/notifications";

const initState = [];

export const notificationsReducer = (notifications = initState, action) => {
    switch (true) {

        case action.type.includes(SET_NOTIFICATION):
            return [...notifications, action];

        case action.type.includes(REMOVE_NOTIFICATION):
            return notifications.filter(notification => notification.payload.id !== action.payload);

        default:
            return notifications;
    }
};