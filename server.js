const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./db/db');
const socketio = require('socket.io');

connectDB();
const app = express();
app.use(cors());
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 3001;
const Server = http.createServer(app);
const io = socketio(Server, {
    cors: {
        origin: "http://localhost:3000",
    }
});

//Routes
app.use('/auth/register', require('./Routes/Register'));
app.use('/auth/login', require('./Routes/Login'));
app.use('/api/room', require('./Routes/Api/Room'));



// Real time communication
io.on('connection', (socket) => {

    socket.on("join user", (data) => {
        // now if and only if user is joined in a room, he is able to access these connections
        socket.join(data.room.roomname);
        socket.broadcast.emit('user joined', data.user.username);
        socket.on("send message", (data) => {
            socket.to(data.roomname).emit('received message', data)
        })
        socket.on('disconnect', () => {
            socket.to(data.room.roomname).emit('disconnected user', (data.user.username))
        })
    })

})

Server.listen(PORT, () => console.log(`Server on port ${PORT}`));