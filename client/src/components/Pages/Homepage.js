import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import SocketContext from '../../context/socket/SocketContext';
import UserContext from '../../context/user/UserContext';


const Homepage = (props) => {
    const socketContext = useContext(SocketContext);
    const {socketConnection} = socketContext;
    
    useEffect( async () => {
       await socketConnection();
    },[])
    const {socket} = socketContext;
    const userContext = useContext(UserContext);
    const {connectRoom} = userContext;

    const [roomName, SetroomName] = useState("");
    const [userName, SetuserName] = useState("");
    const [error, Seterror] = useState("");

    const onSubmit = async (e,type) => {
        e.preventDefault();
        const payload = {
            roomName: roomName,
            userName: userName
        }
        var  request = await type === "create" ? "createRoom" : "joinRoom";
        console.log(request)
        const res = await  axios.post(`http://localhost:3001/api/room/${request}`, payload);
        const data = res.data;
        if(data.error) {
           return Seterror(data.error);
        }
        if(data) {
            connectRoom(socket,payload);
            console.log(data + " homwe")
            props.history.push(`/room/${data.roomName}`);
        }
    }

    const onUserChange = (e) => {
        SetuserName(e.target.value);
    }
    const onRoomChange = (e) => {
        SetroomName(e.target.value);
    }
    return (
        <div>
            <h2>Create Room</h2>
            {error && <h3>{error}</h3>}
            <form onSubmit={(e)=> onSubmit(e,"create")}>
                <input type="text" name="username" placeholder="Username" onChange={onUserChange} />
                <input type="text" name="room_name" placeholder="room name" onChange={onRoomChange} />
                <input type="submit" value="create" />
            </form>
            <h2>Join Room</h2>
            <form onSubmit={(e)=> onSubmit(e,"join")}>
                <input type="text" name="username" placeholder="Username" onChange={onUserChange} />
                <input type="text" name="room_name" placeholder="room name" onChange={onRoomChange} />
                <input type="submit" value="join" />
            </form>
        </div>
    )
}

export default Homepage
