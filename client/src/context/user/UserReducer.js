import { CONNECTED_USER } from '../type';


const UserReducer = (state, action) => {
    switch (action.type) {
        case CONNECTED_USER:
            return {
                ...state,
                userName: action.payload.userName,
                roomName: action.payload.roomName
            }
        default:
            return state;
    }
}

export default UserReducer;