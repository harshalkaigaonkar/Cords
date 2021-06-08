import React, { useReducer, useContext } from 'react';
import RoomContext from './RoomContext';
import RoomReducer from './RoomReducer';
import axios from 'axios';
import ErrorContext from '../error/ErrorContext';
import setAuthToken from '../../Utils/setAuthToken';

import { SET_MESSAGE, SET_ROOM, SOCKET_CONNECTION, PUBLIC_ROOMS } from '../type';

const RoomState = (props) => {

    const errorContext = useContext(ErrorContext);
    const { Seterror } = errorContext;

    const initialState = {
        roomname: '',
        room: {},
        // activeUsers: [],
        messages: [],
        publicRooms: [],
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
        socket.emit('join user', { room, user })
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

    const getAllPublicRooms = async () => {
        if (!localStorage.token) {
            return;
        }
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }
        const res = await axios.get('http://localhost:3001/api/room/getPublicRooms?public=true');
        const data = res.data;
        if (data.error) {
            Seterror(data.error.message);
            return;
        }
        dispatch({ type: PUBLIC_ROOMS, payload: data });
    }
    return (
        <RoomContext.Provider
            value={{
                roomname: state.roomname,
                room: state.room,
                // activeUsers: state.activeUsers,
                messages: state.messages,
                socket: state.socket,
                publicRooms: state.publicRooms,
                getRoomData,
                getAllPublicRooms
            }}
        >
            {props.children}
        </RoomContext.Provider>
    )
}


export default RoomState;