import React, { useContext, useEffect } from 'react'
import AuthContext from '../../context/auth/AuthContext';

const Navbar = (props) => {

    const authContext = useContext(AuthContext);
    const { isAuthenticated, logout, user, loadUser } = authContext;
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
            <div className='app-name'><h1>ChatApp</h1></div>
            {isAuthenticated &&
                <div className='logout pointer'>
                    <input type='submit' value='logout' onClick={onSubmit} />
                    {user && <h3>{user.name}</h3>}
                </div>
            }
        </div>
    )
}

export default Navbar;
