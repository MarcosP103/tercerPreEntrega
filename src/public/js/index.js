// const socket = io()

// socket.emit("message", "Comunicación desde Web Socket");
// socket.on('ind', data => {
//   console.log(data)
// })

// //Chat

// let user
// let chatBox = document.getElementById("chatBox")
// let sendBtn = document.getElementById("sendBtn")

// Swal.fire({
//   title: "Identificate",
//   input: "text",
//   text: "Ingresa tu usuario para identificarte en el chat",
//   inputValidator: (value) => {
//     return !value && "Necesitas escribir un nombre"
//   },
//   allowOutsideClick: false
// }).then(result => {
//   user = result.value
// })

// const sendMessage = () => {
//   if(chatBox.value.trim().length > 0) {
//     socket.emit("message", { user: user, message: chatBox.value })
//     chatBox.value = ""
//   }
// }

// chatBox.addEventListener("keyup", evt => {
//   if(evt.key === "Enter"){
//     sendMessage()
//   }
// })

// sendBtn.addEventListener('click', sendMessage)


// socket.on("messageLogs", data => {
//   let log = document.getElementById("messageLogs")
//   let messages = ""
//   data.forEach(message => {
//     messages = messages + `${message.user} dice: ${message.messages}</br>`
//   })
//   log.innerHTML = messages
// })