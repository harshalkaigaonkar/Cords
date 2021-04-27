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

Server.listen(PORT, () => console.log(`Server on port ${PORT}`));