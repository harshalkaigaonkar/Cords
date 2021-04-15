import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, Setemail] = useState("");
    const [password, Setpassword] = useState("");
    const onSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email,
            password
        }
        const res = await axios.post('http://localhost:3001/auth/login', data);
        // context
        console.log(res.data);
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
                <input value={email} type="text" placeholder="Email" autoFocus onChange={onEmailChange} />
                <input value={password} type="text" placeholder="Password" onChange={onPasswordChange} />
                <input type="submit" value="Login" />
            </form>
        </div>
    )
}

export default Login
