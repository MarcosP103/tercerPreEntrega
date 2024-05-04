import { io } from 'socket.io-client'

const socket = io()

socket.emit("message", "Comunicación desde Web Socket");

socket.on("evento_para_todos", (data) => {
  console.log(data);
});
