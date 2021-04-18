import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/AuthContext'
import axios from 'axios';

const Login = (props) => {
    const authContext = useContext(AuthContext);
    useEffect(() => {
        if (authContext.isAuthenticated) {
            props.history.push('/');
        }
    }, [props.history, authContext.isAuthenticated])
    const [email, Setemail] = useState("");
    const [password, Setpassword] = useState("");
    const onSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email,
            password
        }
        authContext.login(data);
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
