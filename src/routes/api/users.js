import { Router } from "express";
import passport from "passport";
import initializePassport from "../../config/passport.config.js";
import {
  register,
  failRegister,
  login,
  failLogin,
  logout,
  restorePassword,
  githubAuth,
  githubCallback,
  editProfile,
  renderEditProfile,
  reqPassReset,
  resPassword,
  renderPasswordResetForm,
  uploadDocuments,
  renderUploadDocuments,
  renderUserList,
  deleteUserF,
  updateUserRoleF
} from "../../controllers/user.controller.js";
import upload from "../../middleware/multer.js"
import { isAuthenticated, isAdmin } from "../../middleware/auth.js"

const router = Router();
initializePassport();

// Registro y Login
router.post("/register", register);
router.get("/failregister", failRegister);
router.post("/login", login);
router.get("/faillogin", failLogin);

// Logout
router.post("/logout", logout);

// Restablecimiento de Contraseña
router.get("/restorePassword", (req, res) => res.render("resetPass"));
router.post("/restorePassword", restorePassword);

router.get("/requestpasswordreset", (req, res) => res.render('reqPassRes'));
router.post("/requestpasswordreset", reqPassReset);

router.get("/resetpassword/:token", renderPasswordResetForm);
router.post("/resetpassword/:token", resPassword);

router.get("/passwordResetSent", (req, res) => res.render("passwordresetsent"))
router.get("/passwordUpdated", (req, res) => res.render("passwordUpdated"))

// Autenticación con GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), githubAuth);
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), githubCallback);

// Edición de perfil
router.get('/profile/edit', isAuthenticated, renderEditProfile);
router.post('/profile/edit', isAuthenticated, editProfile);

router.get('/:uid/documents', isAuthenticated, renderUploadDocuments);
router.post('/:uid/documents', isAuthenticated, upload.array('documents', 10), uploadDocuments);

router.get('/', isAdmin, renderUserList)
router.delete('/:id', isAdmin, deleteUserF)

//Administrador cambia Rol de otros usuarios
router.put('/:id/role', updateUserRoleF)

export default router;
