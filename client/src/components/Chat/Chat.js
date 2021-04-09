import React, { useState } from 'react';
import { io } from 'socket.io-client';
import Message from './Message';

const socket = io('http://localhost:3001');
socket.on('message', (message) => {
    console.log(message)
});

const Chat = ({ roomName, username }) => {
    const [msg, Setmsg] = useState('');
    const [finalMsg, SetfinalMsg] = useState('');

    socket.on('message-received', (message) => {
        Setmsg(message.msg)
        SetfinalMsg(message.msg);
    })

    const onSubmit = (e) => {
        e.preventDefault();
        const data = {
            roomName: roomName,
            username: username,
            msg: msg,
        }
        // console.log(data);
        socket.emit('send-message', data)
        SetfinalMsg(msg);
        Setmsg('');
    }

    const onChange = (e) => {
        Setmsg(e.target.value);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input autoFocus type="text" name="message" placeholder="message" onChange={onChange} value={msg} />
                <button>Send</button>
            </form>
            <Message message={finalMsg} />
        </div>
    )
}

export default Chat;
