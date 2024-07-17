import userService from "../dao/models/user.model.js";
import { createHash } from "../utils.js";

export const registerUser = async (userData) => {
  const user = await userService.create(userData);
  return await userService.findById(user._id).populate("cartId");
};

export const findUserById = async (userId) => {
  return await userService.findById(userId).populate("cartId");
};

export const findUserByEmail = async (email) => {
  return await userService.findOne({ email });
};

export const updateUserPassword = async (user, newPassword) => {
  user.password = createHash(newPassword);
  await user.save();
};

export const createUser = async (userData) => {
  return await userService.create({
    ...userData,
    password: createHash(userData.password),
  });
};
