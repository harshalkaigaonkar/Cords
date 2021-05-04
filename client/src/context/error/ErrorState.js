import React, { useReducer } from 'react';
import ErrorContext from './ErrorContext';
import { SET_ERRORS, CLEAR_ERRORS } from '../type';
import ErrorReducer from './ErrorReducer';

const ErrorState = (props) => {

    const initialState = {
        error: null
    }

    const [state, dispatch] = useReducer(ErrorReducer, initialState);

    const Seterror = (error) => {
        dispatch({ type: SET_ERRORS, payload: error });

        setTimeout(() => {
            clearError();
        }, 4000);
    }

    const clearError = () => {
        dispatch({ type: CLEAR_ERRORS });
    }

    return (
        <ErrorContext.Provider
            value={{
                error: state.error,
                Seterror,
                clearError
            }}
        >
            {props.children}
        </ErrorContext.Provider>
    )
}


export default ErrorState;