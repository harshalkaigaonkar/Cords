const express = require('express');
const app = express();
const router = express.Router();
const auth = require('../../middleware/auth');
const Room = require('../../models/RoomSchema');
const Message = require('../../models/MessageSchema');
const User = require('../../models/UserSchema');

app.use(express.json())

router.post('/createRoom', auth, async (req, res) => {
    const { roomname, userId, public } = req.body;

    if (!req.body) return res.status(203).send({ error: { message: "no data found" } });

    try {
        const users = [];
        const messages = [];
        users.push(userId);

        const roomData = {
            users,
            createdBy: userId,
            roomname: roomname,
            messages,
            public
        }

        let room = await Room.findOne({ roomname: roomname });

        if (room) return res.status(203).send({ error: { message: "Room is already exist" } })

        room = new Room(roomData);

        await room.save();

        res.status(200).send(room);
    } catch (error) {
        console.log(error);
        res.status(203).send({ error: { message: "Error in Server!" } })
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
        res.status(203).send({ error: { message: "Error in Server!" } })
    }


})

router.get('/getRoom', auth, async (req, res) => {
    try {
        const { roomname } = req.query;
        let room = await Room.findOne({ roomname });

        if (!room) return res.send({ error: { message: "room doesn't exist" } });

        res.status(200).send(room);
    }
    catch (err) {
        console.log(err);
        res.status(203).send({ error: { message: "Error in Server!" } })
    }
})

router.post('/message', auth, async (req, res) => {
    try {
        const { userId, roomname, message } = req.body;
        let room = await Room.findOne({ roomname });
        if (!room) return res.status(200).send({ error: { message: "You cannot send message without being in the room!" } })

        let msg = new Message({
            roomId: room._id,
            sender: userId,
            roomname,
            message,
        })
        await msg.save();
        msg = await msg.populate({ path: "sender", select: "-password" }).execPopulate();
        msg = await msg.populate('roomId').execPopulate();
        await Room.findByIdAndUpdate(room._id, { recentMessage: msg._id })
        res.status(200).send(msg);
    }
    catch (error) {
        console.log(error);
        res.status(203).send({ error: { message: "Error in Server!" } })
    }
})


router.get('/getMessages', auth, async (req, res) => {
    const { roomname } = req.query;
    const userId = req.user.id;
    try {
        let room = await Room.findOne({ roomname, users: { $elemMatch: { $eq: userId } } });

        if (!room) return res.status(203).send({ error: { message: "Your are not part of room. Access Denied!" } });

        let messages = await Message.find({ roomId: room._id }).populate({ path: "sender", select: "-password" });

        res.status(200).send(messages);
    }
    catch (err) {
        console.log(err);
        res.status(203).send({ error: { message: "Error in Server!" } });
    }

})

router.get('/getPublicRooms', auth, async (req, res) => {
    const { public } = req.query;
    try {
        let rooms = await Room.find({ public });
        res.status(200).send(rooms);
    } catch (err) {
        console.log(err);
        res.status(203).send({ error: { message: "Error inServer!" } });
    }
})

module.exports = router;