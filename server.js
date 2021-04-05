const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const Server = app.listen(PORT, () => console.log(`on port ${PORT}`));
const io = require("socket.io")(Server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => console.log('connection established'));

app.get('/', (req, res) => {
    res.send('hello');
});


