import React, { useContext, useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import SocketContext from '../../context/socket/SocketContext';
import UserContext from '../../context/user/UserContext';


var messages = [];
const Chat = () => {
    useEffect(() => {
        getRoomData();
        socket.on('message-received', (message) => {
            addMessageToUi(message);
            console.log(message)
        })
   }, []);
    
    const socketContext = useContext(SocketContext);
    const {socket} = socketContext;

    const userContext = useContext(UserContext);
    const {userName,room} = userContext;

    const roomName = useParams().roomName;
    console.log(roomName)
    const [msg, Setmsg] = useState('');
    const [error, Seterror] = useState("");    
        const addMessageToUi = (message) => {
            var node = document.createElement('li');
            var textnode = document.createTextNode(getMessageUi(message));
            node.appendChild(textnode);
            document.getElementById("message").appendChild(node);
        }
        const getMessageUi = (message) => {
           const element =  `${message.sender} : ${message.message}`;
           return element;
        }
        const getRoomData = async () => {
            const sendData = {
                roomName: roomName,
                userName: userName
            }
            const res = await axios.post('http://localhost:3001/api/room/getRoom', sendData);
            console.log(res.data)
            console.log(sendData)
            const data = res.data;
            if(data.error) {
                Seterror(data.error);
                return;
            }
            if(data) {
                console.log(data.messages)
                messages = data.messages;
            }
        }
       


    const onSubmit = async (e) => {
        e.preventDefault();
        const messagePayload = {
            roomName: roomName,
            userName: userName,
            message: msg,
            recentMessage: msg
        }
        const res = await axios.post('http://localhost:3001/api/room/message', messagePayload);
            const data = res.data;
            console.log(res.data + " insid the message res.data")
            if(data.error) {
               return Seterror(data.error);
            }
            if(data) {
                socket.emit('send-message', data);
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
            <form onSubmit={onSubmit}>
                <input autoFocus type="text" name="message" placeholder="message" onChange={onChange} value={msg} />
                <button>Send</button>
            </form>
            <ul id='message'>
                {
                    messages.map(message => (
                        <li key="message" key={message.sender}>
                           {getMessageUi(message)}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Chat;
