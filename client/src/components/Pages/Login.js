import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import ErrorContext from '../../context/error/ErrorContext';

const Login = (props) => {
    const authContext = useContext(AuthContext);
    const errorContext = useContext(ErrorContext);
    const { isAuthenticated, login } = authContext;
    const { error } = errorContext;

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
            {error && <p>{error}</p>}
            <form onSubmit={onSubmit}>
                <input value={email} type="text" placeholder="Email" onChange={onEmailChange} />
                <input value={password} type="password" placeholder="Password" onChange={onPasswordChange} />
                <input type="submit" value="Login" />
                <Link to='/register'>Don't have an account? Register</Link>
            </form>
        </div>
    )
}

export default Login
