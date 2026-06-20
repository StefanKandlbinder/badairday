import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SubscriptionState } from '../../types';

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: { id: '' } as SubscriptionState,
  reducers: {
    setSubscription(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
  },
});

export const { setSubscription } = subscriptionSlice.actions;
export const { reducer: subscriptionReducer } = subscriptionSlice;
