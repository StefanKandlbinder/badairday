// action types
export const SET_SUBSCRIPTION = 'SET_SUBSCRIPTION';

// action creators
export const setSubscription = (subscription) => ({
    type: `${SET_SUBSCRIPTION}`,
    payload: subscription
});