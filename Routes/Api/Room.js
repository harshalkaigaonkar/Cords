const express = require('express');
const app = express();
const router = express.Router();
const { randomBytes } = require('crypto');
const auth = require('../../middleware/auth');
const Room = require('../../models/RoomSchema');
const Message = require('../../models/MessageSchema');

app.use(express.json())

router.post('/createRoom', auth, async (req, res) => {
    const { roomname, userId } = req.body;

    if (!req.body) return res.status(203).send({ error: { message: "no data found" } });

    try {
        const users = [];
        const messages = [];
        users.push(userId);

        const roomData = {
            users,
            createdBy: userId,
            roomname: roomname,
            messages
        }

        let room = await Room.findOne({ roomname: roomname });

        if (room) return res.status(203).send({ error: { message: "Room is already exist" } })

        room = new Room(roomData);

        await room.save();

        res.status(200).send(room);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: { message: "Error in Server!" } })
    }

})

router.post('/joinRoom', auth, async (req, res) => {

    const { roomname, userId } = req.body;

    if (!req.body) return res.status(203).send({ error: { message: "no data found" } });

    try {

        let room = await Room.findOne({ roomname: roomname });

        if (!room) return res.status(203).send({ error: { message: "Room does not exist" } })

        // room = Room.findByIdAndUpdate({roomname:roomname},{users:})

        await room.save();

        res.status(200).send(room);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: { message: "Error in Server!" } })
    }


})

router.post('/getRoom', auth, async (req, res) => {
    const data = req.body;
    let room = await rooms[data.roomName];
    if (room) {
        return res.send(room)
    }
    res.send({ error: "room doesn't exist" });
})

router.get('/rooms', auth, async (req, res) => {
    res.send(rooms);
})

router.post('/message', auth, (req, res) => {
    const data = req.body;
    let room = rooms[data.roomName];
    if (room) {
        room.recentMessage = data.recentMessage;
        var msg = {
            sender: data.userName,
            message: data.message
        }
        room.messages.push(msg);
        const payload = {
            roomName: data.roomName,
            message: data.message,
            sender: data.userName,
            users: rooms[data.roomName].users,
        }
        return res.send(payload);
    }
    res.send({ error: "room doesn't exist" });
})

module.exports = router;