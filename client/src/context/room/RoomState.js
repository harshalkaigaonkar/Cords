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

    const getRoomData = async (user, roomname) => {
        console.log(user + roomname + " getroomData");
        if (!localStorage.token) {
            return;
        }
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }
        const config = {
            headers: {
                'Content-Type': "application/json"
            }
        }
        const Data = {
            roomname: roomname,
            userId: user._id
        }
        const res = await axios.post('http://localhost:3001/api/room/getRoom', Data, config);
        const data = res.data;
        console.log(data);
        if (data.error) {
            Seterror(data.error.message);
            return;
        }
        if (res.data) {
            console.log(res.data)
            dispatch({ type: SET_ROOM, payload: res.data })
        }

        const messagesData = await axios.post('http://localhost:3001/api/room/getMessages', Data, config);
        console.log(messagesData.data);
        if (messagesData.data.error) {
            Seterror(messagesData.data.error.message);
            return;
        }
        if (messagesData.data) {
            console.log(messagesData);
            dispatch({ type: SET_MESSAGE, payload: messagesData.data })
        }
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