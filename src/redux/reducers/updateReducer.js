import { SET_UPDATE } from "../actions/update";

const initState = {
    timestamp: Date.now()
};

export const updateReducer = (update = initState, action) => {
    switch (action.type) {
        case SET_UPDATE:
            return { ...update, timestamp: action.payload };

        default:
            return update;
    }
};