import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { OptionsState } from '../../types';

const optionsSlice = createSlice({
  name: 'options',
  initialState: { reversegeo: false, autoupdating: false, runaways: false, sort: true, darkMode: false } as OptionsState,
  reducers: {
    setOptionReversegeo(state, action: PayloadAction<boolean>) {
      state.reversegeo = action.payload;
    },
    setOptionAutoupdating(state, action: PayloadAction<boolean>) {
      state.autoupdating = action.payload;
    },
    setOptionRunaways(state, action: PayloadAction<boolean>) {
      state.runaways = action.payload;
    },
    setOptionSort(state, action: PayloadAction<boolean>) {
      state.sort = action.payload;
    },
    setOptionDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
  },
});

export const {
  setOptionReversegeo, setOptionAutoupdating, setOptionRunaways, setOptionSort, setOptionDarkMode,
} = optionsSlice.actions;

export const { reducer: optionsReducer } = optionsSlice;
