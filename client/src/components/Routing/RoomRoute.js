import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';


const RoomRoute = ({ component: Component, ...rest }) => {

    const authContext = useContext(AuthContext);

    const { isAuthenticated, inRoom } = authContext;

    return (
        <Route {...rest} render={props => !isAuthenticated && !inRoom ? (
            <Redirect to='/' />
        ) : (
            <Component {...props} />
        )} />
    )

}

export default RoomRoute