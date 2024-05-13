const socket = io()

socket.emit("message", "Comunicación desde Web Socket");
socket.on('ind', data => {
  console.log(data)
})