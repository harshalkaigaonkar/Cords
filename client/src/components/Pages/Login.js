import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import ErrorContext from '../../context/error/ErrorContext';
import './Auth.css';
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
  }, [props.history, isAuthenticated]);

  const [email, Setemail] = useState('');
  const [password, Setpassword] = useState('');
  const onSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    login(data);
    // context
  };
  const onEmailChange = (e) => {
    Setemail(e.target.value);
  };
  const onPasswordChange = (e) => {
    Setpassword(e.target.value);
  };
  return (
    <div className='auth-page'>
      <div className='auth-form'>
        {error && <p className='error'>{error}</p>}

        <h1>Login</h1>
        <form onSubmit={onSubmit}>
          <input
            value={email}
            type='text'
            placeholder='Email'
            onChange={onEmailChange}
          />
          <input
            value={password}
            type='password'
            placeholder='Password'
            onChange={onPasswordChange}
          />
          <center>
            <button type='submit'>Login</button>
          </center>
          <Link to='/register'>
            <p className='link'>Don't have an account? Register</p>
          </Link>
        </form>
      </div>
      <div className='space-10' />
    </div>
  );
};

export default Login;
