import passport from "passport";
import {
  registerUser,
  findUserById,
  findUserByEmail,
  updateUserPassword,
  createUser,
} from "../services/user.service.js";

export const handleRegister = async (req, res, next) => {
  passport.authenticate("register", async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("failregister");
    }
    try {
      const newUser = await registerUser(user);
      req.session.user = {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        age: newUser.age,
        role: newUser.role,
        cart: newUser.cartId,
      };
      res.send({ status: "success", message: "Usuario registrado" });
    } catch (err) {
      res.status(500).send("Error al registrar al usuario");
    }
  })(req, res, next);
};

export const handleLogin = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/faillogin");
    }
    try {
      const foundUser = await findUserById(user._id);
      req.session.user = {
        first_name: foundUser.first_name,
        last_name: foundUser.last_name,
        email: foundUser.email,
        age: foundUser.age,
        role: foundUser.role,
        cart: foundUser.cartId,
      };
      res.redirect("/api/products");
    } catch (err) {
      res.status(500).send("Error al iniciar sesión");
    }
  })(req, res, next);
};

export const handleFailRegister = (req, res) => {
  res.send({ error: "Fallo" });
};

export const handleFailLogin = (req, res) => {
  res.send({ error: "Login fallido" });
};

export const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error al cerrar sesión");
    }
    res.redirect("/login");
  });
};

export const handleRestorePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res.status(400).send({ status: "error", error: "Datos incompletos" });

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).send("Usuario no encontrado");

    await updateUserPassword(user, newPassword);
    res.send("Contraseña actualizada correctamente");
  } catch (error) {
    res.status(500).send("Error al restaurar la contraseña");
  }
};

export const handleGithubAuth = (req, res) => {};

export const handleGithubCallback = (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  res.redirect("/");
};

export const handleEditProfileView = (req, res) => {
  res.render("editprofile", { user: req.user });
};

export const handleEditProfile = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).send("Todos los campos son requeridos");
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).send("El email ya está registrado");
    }

    const newUser = await createUser({ first_name, last_name, email, age, password });
    req.session.user = newUser;
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error al completar el perfil");
  }
};
