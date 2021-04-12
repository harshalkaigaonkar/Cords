import React,{useReducer} from 'react';
import SocketContext from './SocketContext';
import SocketReducer from './SocketReducer';
import io from 'socket.io-client';
import {SOCKET_CONNECTED} from '../type';



const SocketState = (props) => {

    const initialState = {
        socket: null,
        connected : false
    }

    const [state,dispatch] = useReducer(SocketReducer,initialState);

    const socketConnection = () => {
        const socket = io('http://localhost:3001');
        dispatch({type:SOCKET_CONNECTED,socket:socket})
    }


    return  (
        <SocketContext.Provider 
             value ={{
                 socket:state.socket,
                 connected:state.connected,
                 socketConnection
             }}
        >
           {props.children}
        </SocketContext.Provider>
    )
}


export default SocketState;