import React, { useReducer, useEffect } from 'react';
import AuthContext from './AuthContext';
import AuthReducer from './AuthReducer';
import setAuthToken from '../../Utils/setAuthToken';
import axios from 'axios';
import { USER_REGISTER, USER_LOGIN, GET_USER, USER_LOGOUT } from '../type';



const AuthState = (props) => {

    const initialState = {
        isAuthenticated: null,
        user: null,
        token: localStorage.getItem('token')
    }

    const [state, dispatch] = useReducer(AuthReducer, initialState);

    const loadUser = async () => {
        if(!localStorage.token) {
            return;
        }
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }
        try {
             const res = await axios.get('http://localhost:3001/auth/login');
             console.log(res)
             dispatch({ type: GET_USER, payload: res.data });
           
        } catch (error) {
            console.error(error);
        }
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
            loadUser();
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
            loadUser();
        } catch (error) {
            console.error(error);
            //make error
        }
    }

    //logout is left to be made
    const logout = () => {
        dispatch({type:USER_LOGOUT})
    }
    // clear errors

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                register,
                loadUser,
                login,
                logout
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}


export default AuthState;