import React, { useContext, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';

const Navbar = () => {

    const authContext = useContext(AuthContext);
    const { isAuthenticated, logout, user, loadUser, inRoom } = authContext;
    useEffect(() => {
        if (localStorage.getItem('token') && !isAuthenticated) {
            loadUser();
        }
        // eslint-disable-next-line
    }, [])

    const onSubmit = () => {
        logout();
    }
    return (
        <div className='navbar'>
            <div className='app-name'><a href='/'><h1>ChatApp</h1></a></div>
            {(isAuthenticated && !inRoom) &&
                <div className='logout pointer'>
                    <input type='submit' value='logout' onClick={onSubmit} />
                </div>
            }
            {user && <h3>{user.name}</h3>}
        </div>
    )
}

export default Navbar;
