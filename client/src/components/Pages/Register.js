import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/AuthContext'
import axios from 'axios';

const Register = (props) => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated, register } = authContext;
    
    useEffect(() => {
        if (isAuthenticated) {
            props.history.push('/');
        }
    }, [props.history, isAuthenticated])

    const [email, Setemail] = useState("");
    const [password, Setpassword] = useState("");
    const [name, Setname] = useState("");
    const [username, Setusername] = useState("");
    const onSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name,
            username,
            email,
            password
        }
        register(data);
        // context
    }
    const onEmailChange = (e) => {
        Setemail(e.target.value);
    }
    const onPasswordChange = (e) => {
        Setpassword(e.target.value);
    }
    const onNameChange = (e) => {
        Setname(e.target.value);
    }
    const onUserNameChange = (e) => {
        Setusername(e.target.value);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={name} type="text" placeholder="Name" autoFocus onChange={onNameChange} />
                <input value={username} type="text" placeholder="Username" onChange={onUserNameChange} />
                <input value={email} type="text" placeholder="Email" onChange={onEmailChange} />
                <input value={password} type="password" placeholder="Password" onChange={onPasswordChange} />
                <input type="submit" value="Register" />
            </form>
        </div>
    )
}

export default Register
