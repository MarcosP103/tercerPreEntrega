import {expect} from "chai";
import mongoose from "mongoose";
import { createHash, isSamePassword } from "../src/utils.js";
import userModel from "../src/dao/models/user.model.js";

mongoose.connect('mongodb+srv://mperezro103:eccomerce24@cluster0.9wfhadf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

describe("Test con Chai", () => {
  beforeEach(async () => {
    await userModel.deleteMany({});
  });
  describe("Register User", () => {
    it("Debería registrar un usuario y retornar el usuario completo", async () => {
      const userData = {
        first_name: "Nombre",
        last_name: "Apellido",
        email: "testuser@ejemplo.com",
        age: "30",
        password: "123456",
        cartId: new mongoose.Types.ObjectId(),
        role: "user",
      };

      const newUser = await userModel.create({
        ...userData,
        password: createHash(userData.password),
      });

      const findUser = await userModel.findById(newUser._id);

      expect(findUser).to.exist;
      expect(findUser.email).to.equal(userData.email);
      expect(await isSamePassword("123456", findUser.password)).to.be.true;
    });
  });

  describe("Find User By Email", () => {
    it("Debería encontrar un usuario por su email", async () => {
      const userData = {
        email: "ejemplo@ejemplo.com",
        password: "123456",
      };

      await userModel.create({
        ...userData,
        password: createHash(userData.password),
      });

      const findUser = await userModel.findOne({
        email: "ejemplo@ejemplo.com",
      });

      expect(findUser).to.exist;
      expect(findUser.email).to.equal("ejemplo@ejemplo.com");
    });
  })

  it("Debería lanzar un error si el token es inválido o ha expirado", async () => {
      const user = await userModel.create({
        email: "invalidtoken@example.com",
        password: createHash("password123"),
      });

      const token = "invalidToken";
      const newPassword = "newPassword123";

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() - 3600000;
      await user.save();

      try {
        await resetPassword(token, newPassword);
        throw new Error("No se esperaba que la contraseña se restableciera");
      } catch (error) {
        expect(error.message).to.equal(
          "El token de restablecimiento es invalido o ha expirado."
        );
      }
    });
});
