const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');

connectDB();
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


//Routes
app.use('/auth/register', require('./Routes/Register'));
app.use('/auth/login', require('./Routes/Login'));
app.use('/api/room', require('./Routes/Room'));

// Real time communication
io.on('connection', (socket) => {
    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', 'A new user');
    socket.on('disconnect', () => {
        io.emit('message', 'user leaved');
    })
    socket.on('join-room', (data) => {
        socket.join(data.userName);
    })
    socket.on('send-message', (message) => {
        message.users.forEach(user => {
            if (message.sender !== user) {
                io.to(user).emit('message-received', message);
            }
        })
    })
});
