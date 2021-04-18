import { USER_REGISTER, USER_LOGIN, GET_USER } from '../type';


const AuthReducer = (state, action) => {
    switch (action.type) {
        case USER_REGISTER:
        case USER_LOGIN:
            localStorage.setItem('token', action.payload);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true
            };
        case GET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true
            };
        default:
            return state;
    }
}

export default AuthReducer;