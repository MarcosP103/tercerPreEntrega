import mongoose from "mongoose";

//crear coleccion
const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    quantity: { type: Number, required: true, min: 1 }
  }]
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;
