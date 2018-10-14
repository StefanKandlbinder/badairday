import { API_REQUEST, apiError, apiSuccess } from "../actions/api";
import getUpperAustriaURL from "../../utilities/getUpperAustriaURL";

export const apiMiddleware = ({ dispatch }) => (next) => (action) => {
    next(action);    

    if (action.type.includes(API_REQUEST) && action.meta.provider === "luftdaten") {
        const { body, url, method, feature, provider } = action.meta;

        fetch(url, { body, method })
            .then(response => response.json())
            .then(response => dispatch(apiSuccess({ response, feature, provider })))
            .catch(error => dispatch(apiError({ error: error, feature, provider })))
    }

    if (action.type.includes(API_REQUEST) && action.meta.provider === "upperaustria") {
        const { body, method, feature, provider } = action.meta;

        let url = getUpperAustriaURL(action.meta.url);

        console.log(url);

        fetch(url, { body, method })
            .then(response => response.json())
            .then(response => dispatch(apiSuccess({ response, feature, provider })))
            .catch(error => dispatch(apiError({ error: error, feature, provider })))
    }
};