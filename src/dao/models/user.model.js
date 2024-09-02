import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import { createHash } from "../../utils.js";
import cartsModel from "./carts.model.js";

const documentSchema = new mongoose.Schema ({
  name: { type: String, required: true },
  reference: { type: String, required: true }
})

//crear coleccion
const userCollection = "user";

const userSchema = new mongoose.Schema({
  first_name: { type: String, max: 50 },
  last_name: { type: String, max: 50 },
  email: { type: String, unique: true, index: true },
  age: { type: Number, min: 18 },
  password: { type: String } ,
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
  role: { type: String, enum: ['premium', 'user'], default: 'user'},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  documents: [documentSchema],
  last_connection: {type: Date, default: null}
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
  if (!this.password) {
      throw new Error("La contraseña almacenada no está definida.");
  }
  return bcrypt.compareSync(candidatePassword, this.password);
};


const userModel = mongoose.model( userCollection, userSchema );

export default userModel;
