const express = require('express');
const app = express();
const router = express.Router();

app.use(express.json())

var rooms = [];

router.post('/', (req, res) => {
    const data = req.body;
    rooms.push(data);
    console.log(data);
    console.log(rooms)
    res.json(rooms);
})

module.exports = router;