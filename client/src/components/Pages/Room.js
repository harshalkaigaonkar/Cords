import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import axios from 'axios';



var messages = [];
const Room = () => {
    // takes roomName from Query string URL using useParams Hook.
    const roomName = useParams().roomName;
    const authContext = useContext(AuthContext);
    const { user } = authContext;

    useEffect(() => {
        getRoomData();
        // eslint-disable-next-line
    }, [])

    window.onbeforeunload = (e) => {
        e.preventDefault();
        if (e) {
            alert("you will be disconnected from room")
            e.returnValue = '';
        }
        return '';
    };

    const getRoomData = async () => {
        const sendData = {
            roomName: roomName,
            userName: user.username
        }
        const res = await axios.post('http://localhost:3001/api/room/getRoom', sendData);
        const data = res.data;
        if (data.error) {
            Seterror(data.error);
            return;
        }
        if (data) {
            messages = data.messages;
        }
    }


    const [msg, Setmsg] = useState('');
    const [error, Seterror] = useState('');


    const addMessageToUi = (message) => {
        var node = document.createElement('li');
        var textnode = document.createTextNode(getMessageUi(message));
        node.appendChild(textnode);
        document.getElementById("message").appendChild(node);
    }
    const getMessageUi = (message) => {
        const element = `${message.sender} : ${message.message}`;
        return element;
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const messagePayload = {
            roomName: roomName,
            userName: user.username,
            message: msg,
            recentMessage: msg
        }
        const res = await axios.post('http://localhost:3001/api/room/message', messagePayload);
        const data = res.data;
        if (data.error) {
            return Seterror(data.error);
        }
        if (data) {
            // socket.emit('send-message', data);
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
                        <li key={message.sender}>
                            <p>{message.message}</p>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Room;
