import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { CenterState, Station } from '../../types';

const centerSlice = createSlice({
  name: 'center',
  initialState: { lat: 48.323368, lng: 14.298756 } as CenterState,
  reducers: {
    setCenter(state, action: PayloadAction<Station>) {
      state.station = action.payload;
    },
  },
});

export const { setCenter } = centerSlice.actions;
export const { reducer: centerReducer } = centerSlice;
