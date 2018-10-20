import { SET_UPDATE } from "../actions/update";

const initState = {
    timestamp: Date.now()
};

export const updateReducer = (update = initState, action) => {
    switch (action.type) {

        case action.type.includes(SET_UPDATE):
            return { ...update, update: action.payload };

        default:
            return update;
    }
};