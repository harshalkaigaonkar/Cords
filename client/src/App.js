import React from 'react';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import Chat from "./components/Chat/Chat";
import Homepage from "./components/Pages/Homepage";
import SocketState from './context/socket/SocketState';
import UserState from './context/user/UserState';


const App = () => {
    return (
        <SocketState>
        <UserState>
            <Router>
                <div>
                    <h1>ChatApp</h1>
                    <Switch>
                        <Route exact path='/' component={Homepage} /> 
                        <Route exact path='/room/:roomName' component={Chat} />
                    </Switch>
                </div>
            </Router>
        </UserState>
        </SocketState>
    )
}

export default App;
