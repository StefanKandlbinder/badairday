export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';

export const setNotification = ({ message, feature, type }: { message: unknown; feature: string; type: string }) => ({
  type: `${feature} ${SET_NOTIFICATION}`,
  payload: message,
  meta: { feature, type },
});

export const removeNotification = ({ notificationId, feature }: { notificationId: number; feature: string }) => ({
  type: `${feature} ${REMOVE_NOTIFICATION}`,
  payload: notificationId,
  meta: { feature },
});
