import { LatLng } from '../../types';

export const API_REQUEST = 'API_REQUEST';
export const API_SUCCESS = 'API_SUCCESS';
export const API_ERROR = 'API_ERROR';

export const apiRequest = ({
  body, method, url, feature, provider, update, location,
}: {
  body: null; method: string; url: string; feature: string; provider: string; update: string; location: LatLng | null;
}) => ({
  type: `${feature} ${API_REQUEST} ${update}`,
  payload: body,
  meta: { method, url, feature, provider, update, location },
});

export const apiSuccess = ({
  response, feature, provider, update, location,
}: {
  response: unknown; feature: string; provider: string; update: string; location?: LatLng | null;
}) => ({
  type: `${feature} ${API_SUCCESS} ${update}`,
  payload: response,
  meta: { feature, provider, update, location },
});

export const apiError = ({
  error, feature, provider,
}: {
  error: unknown; feature: string; provider: string;
}) => ({
  type: `${feature} ${API_ERROR}`,
  payload: error,
  meta: { feature, provider },
});
