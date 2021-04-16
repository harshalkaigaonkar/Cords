import React, { useReducer } from 'react';
import UserContext from './UserContext';
import UserReducer from './UserReducer';
import { CONNECTED_USER } from '../type';



const UserState = (props) => {

    const initialState = {
        userName: null,
        roomName: null
    }

    const [state, dispatch] = useReducer(UserReducer, initialState);

    const connectRoom = (socket, payload) => {
        dispatch({ type: CONNECTED_USER, payload: payload })
        socket.emit('join-room', payload);
    }


    return (
        <UserContext.Provider
            value={{
                userName: state.userName,
                roomName: state.roomName,
                connectRoom
            }}
        >
            {props.children}
        </UserContext.Provider>
    )
}


export default UserState;