const express = require('express');
const app = express();
const router = express.Router();
const { randomBytes } = require('crypto');
const auth = require('../middleware/auth');

app.use(express.json())

var rooms = {};

router.post('/createRoom', auth, (req, res) => {
    const data = req.body;
    data.createdBy = data.userName;
    const roomId = randomBytes(5).toString('hex');
    data.roomId = roomId;
    data.users = [data.userName];
    data.messages = [];
    data.recentMessage = '';
    delete data.userName;
    // adding the resultant object into the rooms object.
    rooms[data.roomName] = data;
    res.json(rooms[data.roomName]);
})

router.post('/joinRoom', auth, (req, res) => {
    const data = req.body;
    let room = rooms[data.roomName];
    if (room) {
        room.users.push(data.userName);
        return res.send(room)
    }
    res.send({ error: "room doesn't exist" });
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