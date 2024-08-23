import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

//crear coleccion
const productCollection = "product";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, max: 100, index: true },
  description: { type: String, required: true, max: 100 },
  code: { type: Number, required: true, min: 1, index: true },
  price: { type: Number, required: true, min: 1, index: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true, max: 30, index: true },
  thumbnails: { type: String, required: true },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  }
}, {
  timestamps: true 
});

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
