import { SET_SUBSCRIPTION } from "../actions/subscription";

const initState = {
    id: ""
};

export const subscriptionReducer = (subscription = initState, action) => {
    switch (action.type) {
        case SET_SUBSCRIPTION:
            return { ...subscription, 
               id: action.payload
            };

        default:
            return subscription;
    }
};