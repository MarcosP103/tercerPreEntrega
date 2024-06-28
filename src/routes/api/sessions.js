import { Router } from "express";
import passport from "passport";
import userService from "../../dao/models/user.model.js";
import cartsModel from "../../dao/models/carts.model.js";
import { createHash, isValidPassword } from "../../utils.js";
import initializePassport from "../../config/passport.config.js";

const router = Router();
initializePassport()

// router.post('/register', async (req, res) => {
//     const { first_name, last_name, email, age, password } = req.body;
//     let role = 'user'

//     if ( email === 'adminJuan@gmail.com' && password === 'adminJuan123') {
//         role = 'admin'
//     }

//     try {
//         const newUser = new User({ first_name, last_name, email, age, password: createHash(password) });
//         await newUser.save();
//         res.redirect('/login');
//     } catch (err) {
//         res.status(500).send('Error al registrar usuario');
//     }
// });

router.post("/register", passport.authenticate("register", { failureRedirect: "failregister" }),
  async (req, res) => {
    try {
      const newCart = new cartsModel.create({});

      const user = await userService.findById(req.user._id);
      user.cartId = newCart._id;
      await user.save();

      res.send({ status: "success", message: "Usuario registrado" });
    } catch (err) {
      console.error("Error al registrar usuario: ", err);
      res.status(500).send("Error al registrar al usuario");
    }
  }
);

router.get("/failregister", async (req, res) => {
  console.log("Estrategia fallida");
  res.send({ error: "Fallo" });
});

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).send({ status: "error", error: "Datos incompletos"})
//     try {
//         //validar el password, hay que encriptarlo, luego de los if se puede cambiar res.status por return res.redirect('/login')
//         const user = await User.findOne({ email }, {email: 1, first_name: 1, last_name: 1, password: 1});
//         if (!user) return res.status(404).send('Usuario no encontrado');
//         if (!isValidPassword(user, password)) return res.status(400).send({ status:"error", error: "Password incorrecto"})

//         delete user.password
//         req.session.user = {
//             id: user._id,
//             first_name: user.first_name,
//             last_name: user.last_name,
//             email: user.email,
//             age: user.age,
//         };
//         console.log(req.session.user)
//         res.redirect('/api/products');

//     } catch (err) {
//         res.status(500).send('Error al iniciar sesión');
//     }
// });

router.post("/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Datos incompletos" });
    try {
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        cartId: req.user.cartId,
      };
      console.log(req.session.user);
      res.redirect("/api/products");
    } catch (err) {
      res.status(500).send("Error al iniciar sesión");
    }
  }
);

router.get("/faillogin", (req, res) => {
  res.send({ error: "Login fallido" });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error al cerrar sesión");
    }
    res.redirect("/login");
  });
});

router.get("/restorePassword", (req, res) => {
  res.render("resPass");
});

router.post("/restorePassword", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res.status(400).send({ status: "error", error: "Datos incompletos" });

  try {
    const user = await userService.findOne({ email });
    if (!user) return res.status(400).send("Usuario no encontrado");

    user.password = createHash(newPassword);
    await user.save();
    res.send("Contraseña actualizada correctamente");
  } catch (error) {
    res.status(500).send("Error al restaurar la contraseña");
  }
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"]}),
  (req, res) => {}
);

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    if (!req.user) { 
      return res.redirect("/");
    } 
      res.redirect("/")
  
});

router.get("/editprofile", (req, res) => {
  res.render("editprofile", { user: req.user });
});

router.post("/editprofile", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).send("Todos los campos son requeridos");
  }

  try {
    const existingUser = await userService.findOne({ email });
    if (existingUser) {
      return res.status(400).send("El email ya está registrado");
    }

    const newUser = new userService({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password)
    });
    await newUser.save();
    req.session.user = newUser;
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error al completar el perfil");
  }
});

export default router;
