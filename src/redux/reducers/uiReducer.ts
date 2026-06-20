import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../../types';

const initialState: UIState = {
  loading: false,
  updating: false,
  updaterCount: 0,
  geolocation: false,
  sidebar: false,
  bottomsheet: false,
  favboard: false,
  clusterboard: false,
  media: 'small',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setUpdating(state, action: PayloadAction<boolean>) {
      const count = action.payload ? state.updaterCount + 1 : state.updaterCount - 1;
      state.updaterCount = count;
      state.updating = count !== 0;
    },
    setGeolocation(state, action: PayloadAction<boolean>) {
      state.geolocation = action.payload;
    },
    setSidebar(state, action: PayloadAction<boolean>) {
      state.sidebar = action.payload;
    },
    setBottomsheet(state, action: PayloadAction<boolean>) {
      state.bottomsheet = action.payload;
    },
    setFavboard(state, action: PayloadAction<boolean>) {
      state.favboard = action.payload;
    },
    setClusterboard(state, action: PayloadAction<boolean>) {
      state.clusterboard = action.payload;
    },
    setMedia(state, action: PayloadAction<string>) {
      state.media = action.payload;
    },
  },
});

export const {
  setLoading, setUpdating, setGeolocation, setSidebar,
  setBottomsheet, setFavboard, setClusterboard, setMedia,
} = uiSlice.actions;

export const { reducer: uiReducer } = uiSlice;
