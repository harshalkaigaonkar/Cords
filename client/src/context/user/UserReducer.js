import {CONNECTED_USER} from '../type';


export default (state, action) => {
     switch(action.type) {
         case  CONNECTED_USER :
             return {
                 ...state,
                 userName: action.payload.userName,
                 roomName: action.payload.roomName
             }
         default : 
             return state;
     }
}

