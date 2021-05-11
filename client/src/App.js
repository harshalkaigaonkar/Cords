import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Homepage from "./components/Pages/Homepage";
import Register from "./components/Pages/Register";
import Login from "./components/Pages/Login";
import Room from "./components/Pages/Room";
import PrivateRoute from './components/Routing/PrivateRoute';
import RoomRoute from './components/Routing/RoomRoute';
import setAuthToken from './Utils/setAuthToken';
import Navbar from './components/layout/Navbar';
import AuthState from './context/auth/AuthState';
import ErrorState from './context/error/ErrorState';
import RoomState from './context/room/RoomState';
import './App.css';


if (localStorage.token) {
    setAuthToken(localStorage.token);
}
const App = () => {
    return (
        <ErrorState>
            <AuthState>
                <RoomState>
                    <Router>
                        <Fragment>
                            <Navbar />
                            <div>

                                <Switch>
                                    <PrivateRoute exact path='/' component={Homepage} />
                                    <Route exact path='/register' component={Register} />
                                    <Route exact path='/login' component={Login} />
                                    <RoomRoute exact path='/room/:roomname' component={Room} />
                                </Switch>
                            </div>
                        </Fragment>
                    </Router>
                </RoomState>
            </AuthState>
        </ErrorState>
    )
}

export default App;
