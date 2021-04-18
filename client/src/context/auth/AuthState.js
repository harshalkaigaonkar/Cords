import React, { useReducer, useEffect } from 'react';
import AuthContext from './AuthContext';
import AuthReducer from './AuthReducer';
import setAuthToken from '../../Utils/setAuthToken';
import axios from 'axios';
import { USER_REGISTER, USER_LOGIN, GET_USER } from '../type';



const AuthState = (props) => {

    useEffect(() => {
        loadUser(localStorage.getItem('token'));
    }, [])

    const initialState = {
        isAuthenticated: false,
        user: null,
        token: localStorage.getItem('token')
    }

    const [state, dispatch] = useReducer(AuthReducer, initialState);

    const loadUser = async (token) => {
        if (token) {
            setAuthToken(token);
        }
        const res = await axios.get('http://localhost:3001/auth/login');
        dispatch({ type: GET_USER, payload: res.data });
    }

    const register = async (data) => {
        const config = {
            headers: {
                'Content-Type': "application/json"
            }
        }
        try {
            if (!data) {
                // make error
                return;
            }
            const res = await axios.post('http://localhost:3001/auth/register', data, config);
            console.log(res.data)
            dispatch({ type: USER_REGISTER, payload: res.data.token })
            loadUser(res.data.token);
        } catch (error) {
            console.error(error);
            //make error
        }
    }

    const login = async (data) => {
        const config = {
            headers: {
                'Content-Type': "application/json"
            }
        }
        try {
            if (!data) {
                // make error
                return;
            }
            const res = await axios.post('http://localhost:3001/auth/login', data, config);
            console.log(res.data)
            dispatch({ type: USER_LOGIN, payload: res.data.token })
            loadUser(res.data.token);
        } catch (error) {
            console.error(error);
            //make error
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                register,
                loadUser,
                login
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}


export default AuthState;