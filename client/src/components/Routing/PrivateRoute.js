import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router';
import AuthContext from '../../context/auth/AuthContext';


const PrivateRoute = ({ component: Component, itsRoom, ...rest }) => {

    const authContext = useContext(AuthContext);

    const { isAuthenticated, inRoom } = authContext;

    if (!itsRoom) {
        return (
            <Route {...rest} render={props => isAuthenticated ? (
                <Component {...props} />
            ) : (
                <Redirect to='/login' />
            )} />
        )
    } if (itsRoom)
        return (
            <Route {...rest} render={props => isAuthenticated && inRoom ? (
                <Component {...props} />
            ) : (
                <Redirect to='/' />
            )} />
        )
}

export default PrivateRoute