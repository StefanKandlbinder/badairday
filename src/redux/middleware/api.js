import { API_REQUEST, apiError, apiSuccess } from "../actions/api";
import getUpperAustriaURL from "../../utilities/getUpperAustriaURL";

export const apiMiddleware = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type.includes(API_REQUEST) && action.meta.provider === "luftdaten") {
        const { body, url, method, feature, provider, update, location } = action.meta;

        fetch(url, { body, method })
            .then(handleResponse)
            .then(response => dispatch(apiSuccess({ response, feature, provider, update, location })))
            .catch(error => dispatch(apiError({ error: error, feature, provider })))
    }

    if (action.type.includes(API_REQUEST) && action.meta.provider === "upperaustria") {
        const { body, method, feature, provider, update } = action.meta;

        let url = getUpperAustriaURL(action.meta.url);

        fetch(url, { body, method })
            .then(handleResponse)
            .then(response => dispatch(apiSuccess({ response, feature, provider, update })))
            .catch(error => dispatch(apiError({ error: error, feature, provider })))
    }
};

function handleResponse (response) {
    let contentType = response.headers.get('content-type')
    if (contentType.includes('application/json')) {
      return handleJSONResponse(response)
    } else if (contentType.includes('text/html')) {
      return handleTextResponse(response)
    } else {
      // Other response types as necessary. I haven't found a need for them yet though.
      throw new Error(`Sorry, content-type ${contentType} not supported`)
    }
  }
  
  function handleJSONResponse (response) {
    return response.json()
      .then(json => {
        if (response.ok) {
          return json
        } else {
          return Promise.reject(Object.assign({}, json, {
            status: response.status,
            statusText: response.statusText
          }))
        }
      })
  }

  function handleTextResponse (response) {
    return response.text()
      .then(text => {
        if (response.ok) {
          return text
        } else {
          return Promise.reject({
            status: response.status,
            statusText: response.statusText,
            err: text
          })
        }
      })
  }