import React, { useReducer, useContext } from 'react';
import RoomContext from './RoomContext';
import RoomReducer from './RoomReducer';
import axios from 'axios';
import ErrorContext from '../error/ErrorContext';
import setAuthToken from '../../Utils/setAuthToken';

import { SET_MESSAGE, SET_ROOM, SOCKET_CONNECTION } from '../type';

const RoomState = (props) => {

    const errorContext = useContext(ErrorContext);
    const { Seterror } = errorContext;

    const initialState = {
        roomname: '',
        room: {},
        messages: [],
        socket: null
    }

    const [state, dispatch] = useReducer(RoomReducer, initialState);

    const makeRequest = async (roomname, type) => {
        const res = await axios.get(`http://localhost:3001/api/room/${type}?roomname=${roomname}`);
        const data = res.data;
        if (data.error) {
            Seterror(data.error.message);
            return;
        }
        if (res.data) {
            type = type === 'getRoom' ? SET_ROOM : SET_MESSAGE;
            dispatch({ type: type, payload: res.data })
        }
        return res.data;
    }

    const joinRoom = (room, user, socket) => {
        console.log(room);
        socket.emit('join', { room, user })
    }

    const getRoomData = async (user, roomname, socket) => {
        if (!localStorage.token) {
            return;
        }
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }


        dispatch({ type: SOCKET_CONNECTION, payload: socket });

        const roomData = await makeRequest(roomname, 'getRoom');
        makeRequest(roomname, 'getMessages');
        joinRoom(roomData, user, socket);
    }

    return (
        <RoomContext.Provider
            value={{
                roomname: state.roomname,
                room: state.room,
                messages: state.messages,
                getRoomData,
                socket: state.socket
            }}
        >
            {props.children}
        </RoomContext.Provider>
    )
}


export default RoomState;