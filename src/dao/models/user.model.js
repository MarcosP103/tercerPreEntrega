import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import { createHash } from "../../utils.js";
import cartsModel from "./carts.model.js";

//crear coleccion
const userCollection = "user";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, max: 50 },
  last_name: { type: String, required: true, max: 50 },
  email: { type: String, required: true, unique: true, index: true },
  age: { type: Number, required: true, min: 1 },
  password: { type: String, required: true },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
  role: { type: String, enum: ['admin', 'user'], default: 'user'}
});

userSchema.pre("save", async function(next) {
  if (this.isNew) {
    const newCart = new cartsModel({ user: this._id, products: [] });
    await newCart.save();
    this.cartId = newCart._id;
  }
  next();
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next()

    this.password = createHash(this.password)
    next()
})

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync( candidatePassword, this.password )
}

const userModel = mongoose.model( userCollection, userSchema );

export default userModel;
