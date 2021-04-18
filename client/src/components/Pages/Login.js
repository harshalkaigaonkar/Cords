import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/AuthContext'
import axios from 'axios';

const Login = (props) => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated, login } = authContext;
    useEffect(() => {
        if (isAuthenticated) {
            props.history.push('/');
        }
        // eslint-disable-next-line
    }, [props.history, isAuthenticated])
    const [email, Setemail] = useState("");
    const [password, Setpassword] = useState("");
    const onSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email,
            password
        }
        login(data);
        // context
    }
    const onEmailChange = (e) => {
        Setemail(e.target.value);
    }
    const onPasswordChange = (e) => {
        Setpassword(e.target.value);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={email} type="text" placeholder="Email" onChange={onEmailChange} />
                <input value={password} type="password" placeholder="Password" onChange={onPasswordChange} />
                <input type="submit" value="Login" />
            </form>
        </div>
    )
}

export default Login
