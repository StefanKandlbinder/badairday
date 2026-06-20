import { SubscriptionState } from '../../types';
import { SET_SUBSCRIPTION } from '../actions/subscription';

const initState: SubscriptionState = { id: '' };

interface Action { type: string; payload: unknown }

export const subscriptionReducer = (subscription: SubscriptionState = initState, action: Action): SubscriptionState => {
  switch (action.type) {
    case SET_SUBSCRIPTION:
      return { ...subscription, id: action.payload as string };
    default:
      return subscription;
  }
};
