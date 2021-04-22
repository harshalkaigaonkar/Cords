import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Homepage from "./components/Pages/Homepage";
import Register from "./components/Pages/Register";
import Login from "./components/Pages/Login";
import AuthState from './context/auth/AuthState';
import PrivateRoute from './components/Routing/PrivateRoute';
import setAuthToken from './Utils/setAuthToken'
import Navbar from './components/layout/Navbar';
import './App.css';


if (localStorage.token) {
    setAuthToken(localStorage.token);
}
const App = () => {
    return (
        <AuthState>
            <Router>
                <div>
                    <Navbar />
                    <Switch>
                        <PrivateRoute exact path='/' component={Homepage} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                        {/* <Route exact path='/room/:roomName' component={Chat} /> */}
                    </Switch>
                </div>
            </Router>
        </AuthState>
    )
}

export default App;
