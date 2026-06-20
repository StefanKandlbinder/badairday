import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [] as Notification[],
  reducers: {
    addNotification: {
      reducer(state, action: PayloadAction<Notification>) {
        state.push(action.payload);
      },
      prepare(message: string, type: Notification['type']) {
        return {
          payload: { id: Date.now(), message, type },
        };
      },
    },
    removeNotification(state, action: PayloadAction<number>) {
      return state.filter((n) => n.id !== action.payload);
    },
  },
});

export const { addNotification, removeNotification } = notificationsSlice.actions;
export const { reducer: notificationsReducer } = notificationsSlice;
