import { SET_NOTIFICATION, setNotification } from "../actions/notifications";

export const notificationMiddleware = () => (next) => (action) => {

    if (action.type.includes(SET_NOTIFICATION)) {
        const { payload, meta } = action;
        const id = new Date().getMilliseconds();

        // enrich the original payload with an id
        const notification = {
            id,
            message: payload
        };

        // fire a new action with the enriched payload
        // note: the payload is an object
        next(setNotification({ message: notification, feature: meta.feature }));

    } else {
        next(action)
    }
};