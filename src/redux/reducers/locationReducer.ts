import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { LatLng } from '../../types';

const locationSlice = createSlice({
  name: 'location',
  initialState: { lat: 48.323368, lng: 14.298756 } as LatLng,
  reducers: {
    setLocation(state, action: PayloadAction<LatLng>) {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
    },
  },
});

export const { setLocation } = locationSlice.actions;
export const { reducer: locationReducer } = locationSlice;
