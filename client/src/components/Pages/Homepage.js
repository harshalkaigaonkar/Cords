import React, { Fragment, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../../context/auth/AuthContext';
import ErrorContext from '../../context/error/ErrorContext';
import RoomContext from '../../context/room/RoomContext';
import setAuthToken from '../../Utils/setAuthToken';
import Spinner from '../layout/Spinner'

const Homepage = (props) => {
    const authContext = useContext(AuthContext);
    const errorContext = useContext(ErrorContext);
    const roomContext = useContext(RoomContext);
    const { user, pushUser, removeUser, loading } = authContext;
    const { error, Seterror } = errorContext;
    const { getAllPublicRooms, publicRooms } = roomContext;

    const [roomname, Setroomname] = useState("");
    const [publicRoom, SetpublicRoom] = useState(true);

    useEffect(() => {
        if (!localStorage.token) props.history.push('/login');
        // this is for user that was connected and push back button
        removeUser();
        getAllPublicRooms();
        // eslint-disable-next-line
    }, []);

    const onSubmit = async (e, type) => {
        e.preventDefault();
        if (roomname === '') {
            Seterror('Please enter a room name..');
            return;
        }
        if (!localStorage.token) {
            return;
        }
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }
        const payload = {
            roomname: roomname,
            public: publicRoom,
            userId: user ? user._id : 'Anonymous',
        }
        var request = await type === "create" ? "createRoom" : "joinRoom";
        const res = await axios.post(`http://localhost:3001/api/room/${request}`, payload);
        const data = res.data;
        if (data.error) {
            Seterror(data.error.message);
            return;
        }
        if (data) {
            pushUser();
            props.history.push(`/room/${data.roomname}`);
        }
    }
    const onRoomChange = (e) => {
        Setroomname(e.target.value);
    }

    return (
        <div>
            {user !== null && !loading ? (
                <Fragment>
                    {error && <h3>{error}</h3>}
                    {user && <h3>{user.name}</h3>}
                    <h2>Create Room</h2>
                    <form onSubmit={(e) => onSubmit(e, "create")}>
                        <input type="text" name="room_name" placeholder="room name" onChange={onRoomChange} />
                        <input type="radio" name="roomType" value={publicRoom} onChange={() => SetpublicRoom(true)} defaultChecked />
                        <label>Public</label>
                        <input type="radio" name="roomType" value={publicRoom} onChange={() => SetpublicRoom(false)} />
                        <label>Private</label>
                        <input type="submit" value="create" />
                    </form>
                    <h2>Join Room</h2>
                    <form onSubmit={(e) => onSubmit(e, "join")}>
                        <input type="text" name="room_name" placeholder="room name" onChange={onRoomChange} />
                        <input type="submit" value="join" />
                    </form>
                    <h2>Public Rooms</h2>
                    {   publicRooms.map((room) => (
                        <p key={room._id}>{room.roomname}</p>
                    ))
                    }
                </Fragment>
            ) : (<Spinner />)}
        </div>
    )
}

export default Homepage
