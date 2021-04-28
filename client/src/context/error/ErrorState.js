import React, { useReducer } from 'react';
import ErrorContext from './ErrorContext';
import { SET_ERRORS, CLEAR_ERRORS } from '../type';
import ErrorReducer from './ErrorReducer';

const ErrorState = (props) => {

    const initialState = {
        error: null
    }

    const [state, dispatch] = useReducer(ErrorReducer, initialState);

    const setError = (error) => {
        if (typeof error.message === 'string')
            dispatch({ type: SET_ERRORS, payload: error.message });
        else
            dispatch({ type: SET_ERRORS, payload: error.message[0].msg });

            setTimeout(() => {
                clearError();
            },4000);
    }

    const clearError = () => {
        dispatch({ type: CLEAR_ERRORS });
    }

    return (
        <ErrorContext.Provider
            value={{
                error: state.error,
                setError,
                clearError
            }}
        >
            {props.children}
        </ErrorContext.Provider>
    )
}


export default ErrorState;