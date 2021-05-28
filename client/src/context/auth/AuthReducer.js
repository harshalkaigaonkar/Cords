import { USER_REGISTER, USER_LOGIN, GET_USER, USER_LOGOUT, PUSH_USER, REMOVE_USER } from '../type';


const AuthReducer = (state, action) => {
    switch (action.type) {
        case USER_REGISTER:
        case USER_LOGIN:
            localStorage.setItem('token', action.payload);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            };
        case GET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false
            };
        case PUSH_USER:
            return {
                ...state,
                inRoom: true
            };
        case REMOVE_USER:
            return {
                ...state,
                inRoom: false,
                socket: null,
            };
        case USER_LOGOUT:
            localStorage.removeItem('token')
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false
            };
        default:
            return state;
    }
}

export default AuthReducer;