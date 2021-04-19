import React, { useContext, useEffect } from 'react'
import AuthContext from '../../context/auth/AuthContext';

const Navbar = () => {

    const authContext = useContext(AuthContext);
    const {isAuthenticated,logout,loadUser} = authContext;
    
    useEffect(  () => {
        loadUser();    
        //eslint-disable-next-line
    }, [localStorage.token]);

    const onSubmit = () => {
        logout();
    }
    return (
        <div className='navbar'>
            <div className='app-name'><h1>ChatApp</h1></div>
            {isAuthenticated && 
             <div className='logout pointer'>
                <input type='submit' value='logout' onClick={onSubmit}/> 
             </div>
            }
        </div>
    )
}

export default Navbar;
