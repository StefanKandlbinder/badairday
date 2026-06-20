import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Station, StationsCollection } from '../../types';

const initialState: StationsCollection = { type: 'FeatureCollection', features: [] };

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    setStations(_, action: PayloadAction<StationsCollection>) {
      return action.payload;
    },
    addStation(state, action: PayloadAction<Station>) {
      state.features.push(action.payload);
    },
    updateStation(state, action: PayloadAction<Station>) {
      const u = action.payload;
      const s = state.features.find((f) => f.properties.id === u.properties.id);
      if (!s) return;
      s.properties.date = u.properties.date;
      s.properties.mood = u.properties.mood;
      s.properties.moodRGBA = u.properties.moodRGBA;
      if (u.properties.name) s.properties.name = u.properties.name;
      Object.assign(s.properties.components, u.properties.components);
    },
    updateStationName(state, action: PayloadAction<Station>) {
      const u = action.payload;
      const s = state.features.find((f) => f.properties.id === u.properties.id);
      if (!s) return;
      s.properties.reverseGeoName = u.properties.reverseGeoName ?? s.properties.name;
    },
    favorizeStation(state, action: PayloadAction<string>) {
      const s = state.features.find((f) => f.properties.id === action.payload);
      if (s) s.properties.favorized = true;
    },
    unfavorizeStation(state, action: PayloadAction<string>) {
      const s = state.features.find((f) => f.properties.id === action.payload);
      if (s) s.properties.favorized = false;
    },
    notifyStation(state, action: PayloadAction<string>) {
      const s = state.features.find((f) => f.properties.id === action.payload);
      if (s) s.properties.notify = true;
    },
    unnotifyStation(state, action: PayloadAction<string>) {
      const s = state.features.find((f) => f.properties.id === action.payload);
      if (s) s.properties.notify = false;
    },
  },
});

export const {
  setStations, addStation, updateStation, updateStationName,
  favorizeStation, unfavorizeStation, notifyStation, unnotifyStation,
} = stationsSlice.actions;

export const { reducer: stationsReducer } = stationsSlice;
