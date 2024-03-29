// action types
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';

// action creators
export const setNotification = ({ message, feature, type }) => ({
    type: `${feature} ${SET_NOTIFICATION}`,
    payload: message,
    meta: { feature, type }
});

export const removeNotification = ({ notificationId, feature }) => ({
    type: `${feature} ${REMOVE_NOTIFICATION}`,
    payload: notificationId,
    meta: { feature }
});