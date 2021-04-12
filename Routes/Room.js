const express = require('express');
const app = express();
const router = express.Router();
const { randomBytes } = require('crypto');

app.use(express.json())

var rooms = {};

router.post('/createRoom', (req, res) => {
    const data = req.body;
    data.createdBy = data.userName;
    const roomId = randomBytes(5).toString('hex');
    data.roomId = roomId;
    data.users = [data.userName];
    data.messages = [];
    data.recentMessage = '';
    delete data.userName;
    rooms[data.roomName] = data;

    // console.log(JSON.stringify(rooms) + " rooms create room")
    res.json(rooms[data.roomName]);
})

router.post('/joinRoom', (req, res) => {
    const data = req.body;
    let room = rooms[data.roomName];
    if(room) {
        room.users.push(data.userName);
        return res.send(room)
    }
    res.send({error: "room doesn't exist"});
})

router.post('/getRoom', async(req, res) => {
    const data = req.body;
    // console.log(JSON.stringify(data) + " get Room")
    let room = await rooms[data.roomName];
    // console.log(room +  " Room get room")
    if(room) {
        // console.log(rooms)
        return res.send(rooms[data.roomName])
    }
    res.send({error: "room doesn't exist"});
})

router.get('/rooms', async(req, res) => {
    
    res.send(rooms);
})



router.post('/message', (req, res) => {
    const data = req.body;
    let room = rooms[data.roomName];
    if(room) {
        room.recentMessage = data.recentMessage;
        var msg = {
            sender: data.userName,
            message:data.message
        }
        room.messages.push(msg);
        // console.log(JSON.stringify(room) + " inside of room in message")
        const payload = {
            roomName: data.roomName,
            message:data.message,
            sender:data.userName,
            users: rooms[data.roomName].users,
        }
        return res.send(payload);
    }
    res.send({error: "room doesn't exist"});
})

module.exports = router;