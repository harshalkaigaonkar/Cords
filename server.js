const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./db/db');
const socketio = require('socket.io');
const path = require('path');

// database connection
connectDB();
const app = express();
app.use(cors());
app.use(express.json({ extended: false }));

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

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


const rooms = {};
// later is to changed in cache using redis

// Schema of Rooms :

// rooms = Particular_roomname : [{
//     userId, name, socketId
// }, {.....}, {.......}, .....];


// Real time communication
io.on('connection', (socket) => {

    socket.on("join user", (data) => {
        // now if and only if user is joined in a room, he is able to access these connections
        socket.join(data.room.roomname);
        if (!rooms[data.room.roomname]) {
            rooms[data.room.roomname] = [{
                userId: data.user._id,
                name: data.user.name,
                socketId: socket.id
            }];
        } else {
            rooms[data.room.roomname].push({
                userId: data.user._id,
                name: data.user.name,
                socketId: socket.id
            });
        }
        socket.to(data.room.roomname).emit('user joined', { name: data.user.name, users: rooms[data.room.roomname] });
        socket.on("send message", (data) => {
            socket.to(data.roomname).emit('received message', data)
        })
        socket.on('disconnect', () => {
            let room = rooms[data.room.roomname];
            if (room) {
                const index = room.findIndex(user => user.name === data.user.name);
                if (index !== -1) {
                    room.splice(index, 1);
                }
                if (room.length === 1) {
                    delete room;
                }
            }
            socket.to(data.room.roomname).emit('disconnected user', { name: data.user.name, users: rooms[data.room.roomname] })
        })
        if (rooms[data.room.roomname]) socket.emit('get all active users', rooms[data.room.roomname]);
    })

})

Server.listen(PORT, () => console.log(`Server on port ${PORT}`));