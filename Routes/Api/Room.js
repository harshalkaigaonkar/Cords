const express = require('express');
const app = express();
const router = express.Router();
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

        let room = await Room.findOne({ roomname });
        if (!room) return res.status(203).send({ error: { message: "Room does not exist" } })

        room.users.map(user => {
            if (user === userId) {
                return res.status(200).send(room);
            }
        })

        room = await Room.findByIdAndUpdate(room._id, { $addToSet: { users: userId } }, { new: true })

        res.status(200).send(room);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: { message: "Error in Server!" } })
    }


})

router.post('/getRoom', auth, async (req, res) => {
    try {
        const { roomname, userId } = req.body;
        let room = await Room.findOne({ roomname, users: { $elemMatch: { $eq: userId } } });
        if (!room) return res.send({ error: { message: "room doesn't exist" } });

        res.status(200).send(room);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ error: { message: "Error in Server!" } })
    }
})

router.post('/message', auth, async (req, res) => {
    try {
        const { userId, roomname, message, recentMessage } = req.body;
        let room = await Room.findOne({ roomname });
        console.log(room + " this is a room")
        if (!room) return res.status(200).send({ error: { message: "You cannot send message without being in the room!" } })
        console.log(room);
        let msg = new Message({
            sender: userId,
            roomname,
            message,
        })
        await msg.save();
        await Room.findByIdAndUpdate(room._id, { $addToSet: { messages: message }})
        res.status(200).send(msg);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: { message: "Error in Server!" } })
    }
})

module.exports = router;