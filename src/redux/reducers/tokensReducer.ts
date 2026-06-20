import { TokensState, TokenState } from '../../types';
import { SET_TOKEN_REVERSEGEO } from '../actions/tokens';

const initState: TokensState = { reversegeo: {} };

interface Action { type: string; payload: unknown }

export const tokensReducer = (tokens: TokensState = initState, action: Action): TokensState => {
  switch (true) {
    case action.type.includes(SET_TOKEN_REVERSEGEO):
      return { ...tokens, reversegeo: action.payload as TokenState };
    default:
      return tokens;
  }
};
