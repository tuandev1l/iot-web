import * as io from 'socket.io-client';

export const socket = io.connect('http://localhost:3000', {
  transports: ['websocket'],
});
