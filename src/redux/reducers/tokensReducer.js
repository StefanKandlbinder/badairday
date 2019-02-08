import { SET_TOKEN_REVERSEGEO } from "../actions/tokens";

const initState = {
    reversegeo: {},
};

export const tokensReducer = (tokens = initState, action) => {
    switch (true) {

        case action.type.includes(SET_TOKEN_REVERSEGEO):
            return { ...tokens, reversegeo: action.payload };

        default:
            return tokens;
    }
};