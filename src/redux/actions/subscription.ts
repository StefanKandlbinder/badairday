export const SET_SUBSCRIPTION = 'SET_SUBSCRIPTION';

export const setSubscription = (subscription: string) => ({
  type: SET_SUBSCRIPTION,
  payload: subscription,
});
