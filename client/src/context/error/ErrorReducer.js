import { SET_ERRORS, CLEAR_ERRORS } from '../type';


const ErrorReducer = (state, action) => {
    switch (action.type) {
        case SET_ERRORS:
            return {
                ...state,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
}

export default ErrorReducer;