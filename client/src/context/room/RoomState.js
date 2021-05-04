import React, { useReducer, useContext } from 'react';
import RoomContext from './RoomContext';
import RoomReducer from './RoomReducer';
import axios from 'axios';
import ErrorContext from '../error/ErrorContext';
import setAuthToken from '../../Utils/setAuthToken';
import { SET_MESSAGE, SET_ROOM } from '../type';

const RoomState = (props) => {

    const errorContext = useContext(ErrorContext);
    const { Seterror } = errorContext;

    const initialState = {
        roomname: '',
        room: {},
        messages: []

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
    }

    const getRoomData = (user, roomname) => {
        if (!localStorage.token) {
            return;
        }
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }

        makeRequest(roomname, 'getRoom');
        makeRequest(roomname, 'getMessages');
    }

    return (
        <RoomContext.Provider
            value={{
                roomname: state.roomname,
                room: state.room,
                messages: state.messages,
                getRoomData,
            }}
        >
            {props.children}
        </RoomContext.Provider>
    )
}


export default RoomState;