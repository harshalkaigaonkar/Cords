import React, { useState } from 'react'
import { io } from 'socket.io-client';
import axios from 'axios';
import Chat from '../Chat/Chat';

const Homepage = () => {
    const socket = io('http://localhost:3001');
    const [roomName, SetroomName] = useState("");
    const [username, Setusername] = useState("");
    const onSubmit = async (e) => {
        e.preventDefault();
        const data = {
            roomName: roomName,
            username: username
        }
        // const response = await axios.post('http://localhost:3001/createRoom', data);
        socket.emit('join-room', data)
    }
    const onJoinSubmit = async (e) => {
        e.preventDefault();
        const data = {
            roomName: roomName,
            username: username
        }
        // const response = await axios.get('http://localhost:3001/joinRoom', data);
        socket.emit('join-room', data)
    }
    const onUserChange = (e) => {
        Setusername(e.target.value);
    }
    const onRoomChange = (e) => {
        SetroomName(e.target.value);
    }
    return (
        <div>
            <h2>Create Room</h2>
            <form onSubmit={onSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={onUserChange} />
                <input type="text" name="room_name" placeholder="room name" onChange={onRoomChange} />
                <input type="submit" value="create" />
            </form>
            <h2>Join Room</h2>
            <form onSubmit={onJoinSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={onUserChange} />
                <input type="text" name="room_name" placeholder="room name" onChange={onRoomChange} />
                <input type="submit" value="join" />
            </form>
            <Chat roomName={roomName} username={username} />
        </div>
    )
}

export default Homepage
