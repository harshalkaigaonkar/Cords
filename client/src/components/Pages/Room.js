import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import RoomContext from '../../context/room/RoomContext';
import ErrorContext from '../../context/error/ErrorContext';
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
    const { getRoomData, messages, room } = roomContext;
    const { Seterror, error } = errorContext;
    const [Alert, setAlert] = useState(null);

    useEffect(() => {
        getRoomData(user, roomname, socket);

        socket.on('user joined', (data) => {
            setAlert(`${data} joined the room`);
            setTimeout(() => {
                setAlert(null);
            }, 3000)
        })

        socket.on("received message", (message) => {
            addMessageToUi(message);
        })
        socket.on("disconnected user", (user) => {

            setAlert(`${user} left the room`);
            setTimeout(() => {
                setAlert(null);
            }, 3000)
        });
        // eslint-disable-next-line
    }, [])



    const [msg, Setmsg] = useState('');

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
        if (data.error) {
            Seterror(data.error.message);
            return;
        }
        if (data) {
            socket.emit('send message', data);
        }
        addMessageToUi(data);
        Setmsg('');
    }

    const onDisconnection = () => {
        room.username = user.username;
        room.userId = user._id;
        socket.emit('disconnect user', room);
        removeUser();
    }

    const onChange = (e) => {
        Setmsg(e.target.value);
    }
    return (
        <div>
            {error && <h3>{error}</h3>}
            <div className='logout pointer'>
            </div>
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
            {Alert && <h3>{Alert}</h3>}
            <input type='submit' value='disconnect' onClick={onDisconnection} />
        </div>
    )
}

export default Room;
