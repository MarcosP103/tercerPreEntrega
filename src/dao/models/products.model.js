import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

//crear coleccion
const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, max: 100, index: true },
  description: { type: String, required: true, max: 100 },
  code: { type: Number, required: true, min: 1, index: true },
  price: { type: Number, required: true, min: 1, index: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true, min: 1 },
  category: { type: String, required: true, max: 30, index: true },
  thumbnail: { type: String, required: true },
  default: [],
});

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
