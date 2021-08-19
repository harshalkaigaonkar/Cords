import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import RoomContext from '../../context/room/RoomContext';
import ErrorContext from '../../context/error/ErrorContext';
import './Room.css';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const Room = (props) => {
    // takes roomname from Query string URL using useParams Hook.
    const roomname = useParams().roomname;

    const authContext = useContext(AuthContext);
    const roomContext = useContext(RoomContext);
    const errorContext = useContext(ErrorContext);

    const { user, removeUser } = authContext;
    const { getRoomData, messages } = roomContext;
    const { Seterror, error } = errorContext;

    const [msg, Setmsg] = useState("");
    const [Alert, SetAlert] = useState(null);
    const [stream, Setstream] = useState(null);
    const activeUsers = useRef();

    useEffect(() => {

        getRoomData(user, roomname, socket);

        socket.on('user joined', (data) => {
            activeUsers.current = data.users;
            SetAlert(`${data.name} joined the room`);
            setTimeout(() => {
                SetAlert(null);
            }, 3000)
        })

        socket.on("received message", (message) => {
            if (message.roomname === roomname) {
                addMessageToUi(message);
            }
        })
        socket.on("disconnected user", (data) => {
            activeUsers.current = data.users;
            SetAlert(`${data.name} left the room`);
            setTimeout(() => {
                SetAlert(null);
            }, 3000)
        });
        socket.on('get all active users', (data) => {
            if (data !== undefined) {
                activeUsers.current = data;
            }
        })
        // eslint-disable-next-line
    }, [])


    const addMessageToUi = (message) => {
        var node = document.createElement('li');
        var textnode = document.createTextNode(getMessageUi(message));
        node.appendChild(textnode);
        document.getElementById("message").appendChild(node);
    }
    const getMessageUi = (message) => {
        const element = `${message.sender.name} : ${message.message}`;
        return element;
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (msg === '') {
            Seterror("please enter something!!")
            return;
        }
        const messagePayload = {
            roomname: roomname,
            userId: user._id,
            message: msg,
        }
        const res = await axios.post('http://localhost:3001/api/room/message', messagePayload);
        const data = res.data;
        console.log(data)
        if (data.error) {
            console.log(data)
            Seterror(data.error.message);
            return;
        }
        if (data) {
            socket.emit('send message', data);
        }
        addMessageToUi(data);
        Setmsg('');
    }

    const onDisconnection = async (e) => {
        e.preventDefault();
        removeUser();
        window.location = '/';
    }

    const onChange = (e) => {
        Setmsg(e.target.value);
    }
    return (
        <div className='chatPage'>
            <div className='chats'>
                <h2>{roomname}</h2>
                <h2>online users :</h2>
                {activeUsers.current &&
                    activeUsers.current.map(user => (
                        <h5 key={user.socketId}> {user.name} </h5>
                    ))
                }
            </div>
            <div className='chatContent'>
                <ul id='message'>
                    {
                        messages.map(message => (
                            <li className='msg-content' key={message._id}>
                                {getMessageUi(message)}
                            </li>
                        ))
                    }
                </ul>

                <div className='chat-footer'>
                    <form onSubmit={onSubmit} className='msg-send'>
                        <input className='dis-btn' type='submit' value='disconnect' onClick={onDisconnection} />
                        <input className='msg-input' autoFocus type="text" name="message" placeholder="message" onChange={onChange} value={msg} />
                        <button className='send-btn'>Send</button>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Room;
