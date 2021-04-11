const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 3001;
const Server = app.listen(PORT, () => console.log(`on port ${PORT}`));
const io = require("socket.io")(Server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});


app.get('/', (req, res) => {
    res.send('hello');
});

// app.use('/createRoom', require('./Routes/createRoom'));
// app.use('/joinRoom', require('./Routes/joinRoom'));

// Real time communication
io.on('connection', (socket) => {
    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', 'A new user');
    socket.on('disconnect', () => {
        io.emit('message', 'user leaved');
    })
    socket.on('join-room', (data) => {
        console.log(data.roomName + data.username + 'join-room')
        socket.join(data.roomName);

    })
    socket.on('send-message', (message) => {
        console.log(message.msg + message.roomName + message.username + "send-message")
        io.in(message.roomName).emit('message-received', message);
    })
});
