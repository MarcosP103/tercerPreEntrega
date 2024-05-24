import mongoose from "mongoose";

//crear coleccion
const cartsCollection = "Carrito";

const cartsSchema = new mongoose.Schema({
  id: { type: Number, required: true, max: 100, index: true },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: productCollection,
      default: [],
    },
  ],
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;
