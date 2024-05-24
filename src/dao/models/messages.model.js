import mongoose from "mongoose";

//crear coleccion
const messageCollection = "Mensajes";

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true, max: 30 },
  message: { type: String, required: true, max: 200 },
});

const messageModel = mongoose.model(messageCollection, messageSchema);

export default messageModel;
