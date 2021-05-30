import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import RoomContext from '../../context/room/RoomContext';
import ErrorContext from '../../context/error/ErrorContext';
import axios from 'axios';
import Peer from 'peerjs';
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

    const [msg, Setmsg] = useState("");
    const [Alert, SetAlert] = useState(null);
    const [stream, Setstream] = useState(null);
    const [RecievingCall, SetRecievingCall] = useState(false);
    const [Caller, SetCaller] = useState("");
    const [CallerSignal, SetCallerSignal] = useState();
    const [CallAccepted, SetCallAccepted] = useState(false);
    const [IdToCall, SetIdToCall] = useState("");
    const [CallEnded, SetCallEnded] = useState(false);
    const [Name, SetName] = useState("");

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            Setstream(stream);
            myVideo.current.srcObject = stream;
        });

        getRoomData(user, roomname, socket);

        socket.on('user joined', (data) => {
            SetAlert(`${data} joined the room`);
            setTimeout(() => {
                SetAlert(null);
            }, 3000)
        })

        socket.on("received message", (message) => {
            if (message.roomname === roomname) {
                addMessageToUi(message);
            }
        })
        socket.on("disconnected user", (user) => {

            SetAlert(`${user} left the room`);
            setTimeout(() => {
                SetAlert(null);
            }, 3000)
        });

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

    const onDisconnection = (e) => {
        e.preventDefault();
        removeUser();
        window.location = '/';
    }

    const onChange = (e) => {
        Setmsg(e.target.value);
    }
    return (
        <div>
            {error && <h3>{error}</h3>}
            <h2>{roomname}</h2>
            <input type='submit' value='disconnect' onClick={onDisconnection} />
            {Alert && <h3>{Alert}</h3>}
            <div>
                {stream && <video style={{ width: "300px" }} muted autoPlay ref={myVideo} />}
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
        </div>
    )
}

export default Room;
