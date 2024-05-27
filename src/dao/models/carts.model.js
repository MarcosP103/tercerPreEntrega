import mongoose from "mongoose";

//crear coleccion
const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: { type: Number, required: true, min: 1 },
      default: [],
    },
  ],
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;
