import React, { useEffect } from 'react';
// import axios from 'axios';
import { io } from 'socket.io-client';

const App = () => {
  useEffect(() => {
    const socket = io('http://localhost:3001');
    console.log('socket connected');
    // eslint-disable-next-line
  }, [])
  return (
    <div>
      ChatApp
    </div>
  )
}

export default App
