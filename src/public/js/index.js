const socket = io();

//Chat
let user;
let chatBox = document.getElementById("chatBox");
let sendBtn = document.getElementById("sendBtn");

if (userAuthenticated) {
  user = userAuthenticated.first_name
} else {
  Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa tu usuario para identificarte en el chat",
    inputValidator: (value) => {
      return !value && "Necesitas escribir un nombre";
    },
    allowOutsideClick: false,
  }).then((result) => {
    user = result.value;
  });
}

const sendMessage = () => {
  if (chatBox.value.trim().length > 0) {
    console.log("Enviando mensaje:", { user: user, message: chatBox.value });
    socket.emit("message", { user: user, message: chatBox.value });
    chatBox.value = "";
  }
};

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    sendMessage();
  }
});

sendBtn.addEventListener("click", sendMessage);

socket.on("messageLogs", (data) => {
  console.log("Recibiendo mensajes:", data);
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((message) => {
    messages += `${message.user} dice: ${message.message}</br>`;
  });
  log.innerHTML = messages;
});
