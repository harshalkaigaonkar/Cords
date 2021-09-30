import React, { useReducer, useContext } from 'react';
import AuthContext from './AuthContext';
import AuthReducer from './AuthReducer';
import ErrorContext from '../error/ErrorContext';
import setAuthToken from '../../Utils/setAuthToken';
import axios from 'axios';
import { USER_REGISTER, USER_LOGIN, GET_USER, USER_LOGOUT, PUSH_USER, REMOVE_USER } from '../type';



const AuthState = (props) => {

    const errorContext = useContext(ErrorContext);
    const { Seterror } = errorContext;

    const initialState = {
        isAuthenticated: false,
        user: null,
        token: localStorage.getItem('token'),
        inRoom: false,
        loading: true,
    }

    const [state, dispatch] = useReducer(AuthReducer, initialState);

    const loadUser = async () => {
        if (!localStorage.token) {
            return;
        }
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }
        const res = await axios.get('http://localhost:3001/auth/login');
        if(!res.data) {
            localStorage.removeItem('token');
            Seterror("Invalid token");
            return;
        }
        if (res.data && res.data.error) {
            localStorage.removeItem('token');
            Seterror(res.data.error);
            return;
        }
        if (res.data) {
            dispatch({ type: GET_USER, payload: res.data });
        }
    }

    const register = async (data) => {
        const config = {
            headers: {
                'Content-Type': "application/json"
            }
        }

        if (!data) {
            Seterror('Error Occured!!');
        }
        const res = await axios.post('http://localhost:3001/auth/register', data, config);
        if (res.data && res.data.error) {
            Seterror(res.data.error);
            return;
        }
        if (res.data) {
            dispatch({ type: USER_REGISTER, payload: res.data.token })
            loadUser();
        }
    }

    const login = async (data) => {
        const config = {
            headers: {
                'Content-Type': "application/json"
            }
        }
        if (!data) {
            // make error
            return;
        }
        const res = await axios.post('http://localhost:3001/auth/login', data, config);
        if (res.data && res.data.error) {
            Seterror(res.data.error);
            return;
        }
        if (res.data) {
            dispatch({ type: USER_LOGIN, payload: res.data.token })
            loadUser();
        }
    }
    const pushUser = () => {
        dispatch({ type: PUSH_USER })
    }
    const removeUser = () => {
        dispatch({ type: REMOVE_USER })
    }
    const logout = () => {
        dispatch({ type: USER_LOGOUT })
    }

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                inRoom: state.inRoom,
                error: state.error,
                loading: state.loading,
                register,
                loadUser,
                login,
                pushUser,
                removeUser,
                logout
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}


export default AuthState;