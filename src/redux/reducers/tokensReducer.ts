import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TokensState, TokenState } from '../../types';

const tokensSlice = createSlice({
  name: 'tokens',
  initialState: { reversegeo: {} } as TokensState,
  reducers: {
    setTokenReversegeo(state, action: PayloadAction<TokenState>) {
      state.reversegeo = action.payload;
    },
  },
});

export const { setTokenReversegeo } = tokensSlice.actions;
export const { reducer: tokensReducer } = tokensSlice;
