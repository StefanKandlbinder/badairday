import { TokenState } from '../../types';

export const SET_TOKEN_REVERSEGEO = 'SET_TOKEN_REVERSEGEO';

export const setTokenReverseGeo = ({ state, feature }: { state: TokenState; feature: string }) => ({
  type: `${feature} ${SET_TOKEN_REVERSEGEO}`,
  payload: state,
  meta: { feature },
});
