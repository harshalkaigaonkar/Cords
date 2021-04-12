import {SOCKET_CONNECTED} from '../type';


export default (state, action) => {
     switch(action.type) {
         case  SOCKET_CONNECTED :
             return {
                 ...state,
                  socket: action.socket,
                  connected: true
             }
         default : 
             return state;
     }
}

