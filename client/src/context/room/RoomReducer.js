import { SET_ROOM, SET_MESSAGE } from '../type.js';


const RoomReducer = (state, action) => {
    switch (action.type) {
        case SET_ROOM:
            return {
                ...state,
                room: action.payload,
                roomname: action.payload.roomname
            };
        case SET_MESSAGE:
            return {
                ...state,
                messages: action.payload
            }
        default:
            return state;
    }
}

export default RoomReducer;