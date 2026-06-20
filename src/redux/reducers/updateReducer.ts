import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UpdateState } from '../../types';

const updateSlice = createSlice({
  name: 'update',
  initialState: { timestamp: Date.now() } as UpdateState,
  reducers: {
    setUpdate(state, action: PayloadAction<number>) {
      state.timestamp = action.payload;
    },
  },
});

export const { setUpdate } = updateSlice.actions;
export const { reducer: updateReducer } = updateSlice;
