const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Room = mongoose.Schema({
    roomname: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    recentMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    public: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Room', Room);