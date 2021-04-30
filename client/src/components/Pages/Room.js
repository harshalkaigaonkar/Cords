import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

var messages = [];
const Room = () => {
    // takes roomname from Query string URL using useParams Hook.
    const roomname = useParams().roomname;
    console.log(roomname)
    const authContext = useContext(AuthContext);
    const { user } = authContext;
    const [Room, setRoom] = useState({});
    const getRoomData = async () => {
        const sendData = {
            roomname: roomname,
            userId: user._id
        }
        const res = await axios.post('http://localhost:3001/api/room/getRoom', sendData);
        const data = res.data;
        if (data.error) {
            Seterror(data.error.message);
            return;
        }

        if (data) {
            setRoom(data);
            messages = data.messages;
        }
    }

    console.log(messages);

    useEffect(() => {
        getRoomData();
        socket.emit('join', user);

        socket.on("received message", (message) => {
            console.log(message);
            addMessageToUi(message);
        })
        // eslint-disable-next-line
    }, [])

    window.onbeforeunload = (e) => {
        e.preventDefault();
        if (e) {
            e.returnValue = '';
        }
        return '';
    };




    const [msg, Setmsg] = useState('');
    const [error, Seterror] = useState('');


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
        const messagePayload = {
            roomname: roomname,
            userId: user._id,
            message: msg,
        }
        const res = await axios.post('http://localhost:3001/api/room/message', messagePayload);
        const data = res.data;
        if (data.error) {
            return Seterror(data.error);
        }
        if (data) {
            data.users = Room.users;
            socket.emit('send message', data);
        }
        addMessageToUi(data);
        Setmsg('');
    }

    const onChange = (e) => {
        Setmsg(e.target.value);
    }
    return (
        <div>
            {error && <h3>{error}</h3>}
            {/* <h1>{user.username}</h1> */}
            <form onSubmit={onSubmit}>
                <input autoFocus type="text" name="message" placeholder="message" onChange={onChange} value={msg} />
                <button>Send</button>
            </form>
            <ul id='message'>
                {
                    messages.map(message => (
                        <li key={message._id}>
                            {getMessageUi(message)}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Room;
