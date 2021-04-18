import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Chat from "./components/Chat/Chat";
import Homepage from "./components/Pages/Homepage";
import Register from "./components/Pages/Register";
import Login from "./components/Pages/Login";
import SocketState from './context/socket/SocketState';
import AuthState from './context/auth/AuthState';
import UserState from './context/user/UserState';
import PrivateRoute from './components/Routing/PrivateRoute';
import setAuthToken from './Utils/setAuthToken'

if (localStorage.getItem('token')) {
    setAuthToken(localStorage.getItem('token'));
}

const App = () => {
    return (
        <AuthState>
            <SocketState>
                <UserState>
                    <Router>
                        <div>
                            <h1>ChatApp</h1>
                            <Switch>
                                <Route exact path="/register" component={Register} />
                                <Route exact path="/login" component={Login} />
                                <PrivateRoute exact path='/' component={Homepage} />
                                <Route exact path='/room/:roomName' component={Chat} />
                            </Switch>
                        </div>
                    </Router>
                </UserState>
            </SocketState>
        </AuthState>
    )
}

export default App;
