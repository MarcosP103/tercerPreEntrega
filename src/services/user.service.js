import userService from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const registerUser = async (userData) => {
  const user = await userService.create({
    ...userData,
    password: createHash(userData.password),
  });
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

export const requestPasswordReset = async (email) => {
  const user = await userService.findOne({ email });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const token = crypto.randomBytes(20).toString("hex");
  const tokenExpiry = Date.now() + 3600000;

  user.resetPasswordToken = token;
  user.resetPasswordExpires = tokenExpiry;
  await user.save();

  const resetLink = `http://localhost:8080/resetpassword/${token}`;

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: "Restablecimiento de contraseña",
    text: `Estas recibiendo este correo porque tu(u otra persona) has solicitado el restablecimiento de la contraseña de tu cuenta.\n\nHaga clic en el siguiente enlace o peguelo en su navegador para completar el proceso dentro de una hora despues de rebiirlo: \n\n${resetLink}\n\nSi no solicitó este cambio, ignore este correo electrónico y su contraseña permanecerá sin cambios.\n`,
  };

  await transporter.sendMail(mailOptions)
};

export const resetPassword = async (token, password) => {
  const user = await userService.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  })

  if (!user) {
    throw new Error("El token de restablecimiento es invalido o ha expirado.")
  }
  
  if (!isValidPassword(password, user.password)) {
    throw new Error ("No puede usar la misma contraseña.")
  }

  user.password = createHash(password)
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()
}

export const validateResetToken = async (token) => {
  const user = await userService.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  return !!user;
};