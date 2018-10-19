// action types
export const API_REQUEST = 'API_REQUEST';
export const API_SUCCESS = 'API_SUCCESS';
export const API_ERROR = 'API_ERROR';

// action creators
export const apiRequest = ({ body, method, url, feature, provider, update }) => ({
    type: `${feature} ${API_REQUEST}`,
    payload: body,
    meta: { method, url, feature, provider, update }
});

export const apiSuccess = ({ response, feature, provider, update }) => ({
    type: `${feature} ${API_SUCCESS} ${update}`,
    payload: response,
    meta: { feature, provider, update }
});

export const apiError = ({ error, feature }) => ({
    type: `${feature} ${API_ERROR}`,
    payload: error,
    meta: { feature }
});