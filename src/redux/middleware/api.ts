import { Action, MiddlewareAPI } from '../../types';
import { API_REQUEST, apiError, apiSuccess } from '../actions/api';
import getUpperAustriaURL from '../../utilities/getUpperAustriaURL';

function handleResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json().then((json) => {
      if (response.ok) return json;
      return Promise.reject(Object.assign({}, json, { status: response.status, statusText: response.statusText }));
    });
  } else if (contentType.includes('text/html')) {
    return response.text().then((text) => {
      if (response.ok) return text;
      return Promise.reject({ status: response.status, statusText: response.statusText, err: text });
    });
  }
  throw new Error(`Sorry, content-type ${contentType} not supported`);
}

export const apiMiddleware = ({ dispatch }: MiddlewareAPI) => (next: (a: Action) => void) => (action: Action): void => {
  next(action);

  const meta = action.meta as Record<string, unknown> | undefined;
  if (!meta || !action.type.includes(API_REQUEST)) return;

  const { body, url, method, feature, provider, update, location } = meta as {
    body: BodyInit | null;
    url: string;
    method: string;
    feature: string;
    provider: string;
    update: string;
    location: unknown;
  };

  if (provider === 'luftdaten') {
    fetch(String(url), { body, method })
      .then(handleResponse)
      .then((response) => dispatch(apiSuccess({ response, feature, provider, update, location: location as never })))
      .catch((error) => dispatch(apiError({ error, feature, provider })));
  }

  if (provider === 'upperaustria') {
    const resolvedUrl = getUpperAustriaURL(String(url));
    fetch(resolvedUrl, { body, method })
      .then(handleResponse)
      .then((response) => dispatch(apiSuccess({ response, feature, provider, update })))
      .catch((error) => dispatch(apiError({ error, feature, provider })));
  }
};
