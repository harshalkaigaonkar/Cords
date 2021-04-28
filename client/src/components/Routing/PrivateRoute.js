import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router';
import AuthContext from '../../context/auth/AuthContext';


const PrivateRoute = ({ component: Component, itsRoom, ...rest }) => {

    const authContext = useContext(AuthContext);

    const { isAuthenticated, inRoom } = authContext;

    if (itsRoom) {
        return (
            <Route {...rest} render={props => !inRoom ? (
                <Redirect to='/' />
            ) : (
                <Component {...props} />
            )} />
        )
    } else
        return (
            <Route {...rest} render={props => !isAuthenticated ? (
                <Redirect to='/login' />
            ) : (
                <Component {...props} />
            )} />
        )
}

export default PrivateRoute