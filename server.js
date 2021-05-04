const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./db/db');

connectDB();
const app = express();
app.use(cors());
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 3001;
const Server = http.createServer(app);
const io = require("socket.io")(Server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});


//Routes
app.use('/auth/register', require('./Routes/Register'));
app.use('/auth/login', require('./Routes/Login'));
app.use('/api/room', require('./Routes/Api/Room'));

// Real time communication
io.on('connection', (socket) => {
    socket.on("join", (data) => {
        socket.join(data.user._id);
        data.room.users.map((user) => {
            socket.to(user).emit('user joined', data.user.username);
        })
    })

    socket.on('disconnect user', (room) => {
        room.users.map(user => {
            socket.to(user).emit('disconnected user', (room.username))
        });
        socket.leave(room.userId);
    })

    socket.on("send message", (data) => {

        data.roomId.users.map(user => {
            if (user !== data.sender) {
                socket.to(user).emit("received message", data);
            }
        })
    })
})

Server.listen(PORT, () => console.log(`Server on port ${PORT}`));