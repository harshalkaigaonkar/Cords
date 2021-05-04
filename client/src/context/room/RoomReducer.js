import { SET_ROOM, SET_MESSAGE, SOCKET_CONNECTION } from '../type.js';


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
        case SOCKET_CONNECTION:
            return {
                ...state,
                socket: action.payload
            }
        default:
            return state;
    }
}

export default RoomReducer;