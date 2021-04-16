import { SOCKET_CONNECTED } from '../type';


const SocketReducer = (state, action) => {
    switch (action.type) {
        case SOCKET_CONNECTED:
            return {
                ...state,
                socket: action.socket,
                connected: true
            }
        default:
            return state;
    }
}

export default SocketReducer;
