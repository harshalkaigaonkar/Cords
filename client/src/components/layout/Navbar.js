import React, { useContext, useEffect } from 'react'
import AuthContext from '../../context/auth/AuthContext';

const Navbar = () => {

    const authContext = useContext(AuthContext);
    const { isAuthenticated, logout, loadUser, user } = authContext;

    useEffect(() => {
        loadUser();
        //eslint-disable-next-line
    }, []);

    const onSubmit = () => {
        logout();
    }
    return (
        <div className='navbar'>
            <div className='app-name'><h1>ChatApp</h1></div>
            {isAuthenticated &&
                <div className='logout pointer'>
                    <input type='submit' value='logout' onClick={onSubmit} />
                    <h1>{user.name}</h1>
                </div>
            }
        </div>
    )
}

export default Navbar;
