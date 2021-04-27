import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../../context/auth/AuthContext';
import setAuthToken from '../../Utils/setAuthToken';



const Homepage = (props) => {
    const authContext = useContext(AuthContext);
    const { loadUser, user } = authContext;

    useEffect(() => {
        loadUser();

        //eslint-disable-next-line
    }, []);
    const [roomName, SetroomName] = useState("");
    const [error, Seterror] = useState("");

    const onSubmit = async (e, type) => {
        e.preventDefault();
        if (!localStorage.token) {
            return;
        }
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }
        const payload = {
            roomName: roomName,
            userName: user.username
        }
        var request = await type === "create" ? "createRoom" : "joinRoom";
        const res = await axios.post(`http://localhost:3001/api/room/${request}`, payload);
        const data = res.data;
        if (data.error) {
            return Seterror(data.error);
        }
        if (data) {
            props.history.push(`/room/${data.roomName}`);
        }
    }
    const onRoomChange = (e) => {
        SetroomName(e.target.value);
    }
    return (
        <div>
            <h2>Create Room</h2>
            {error && <h3>{error}</h3>}
            <form onSubmit={(e) => onSubmit(e, "create")}>
                <input type="text" name="room_name" placeholder="room name" onChange={onRoomChange} />
                <input type="submit" value="create" />
            </form>
            <h2>Join Room</h2>
            <form onSubmit={(e) => onSubmit(e, "join")}>
                <input type="text" name="room_name" placeholder="room name" onChange={onRoomChange} />
                <input type="submit" value="join" />
            </form>
            <h2>Public Rooms</h2>
        </div>
    )
}

export default Homepage
