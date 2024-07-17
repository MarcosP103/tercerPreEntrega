import { Router } from "express";
import passport from "passport";
import initializePassport from "../../config/passport.config.js";
import {
  handleRegister,
  handleFailRegister,
  handleLogin,
  handleFailLogin,
  handleLogout,
  handleRestorePassword,
  handleGithubAuth,
  handleGithubCallback,
  handleEditProfileView,
  handleEditProfile,
} from "../../controllers/user.controller.js";

const router = Router();
initializePassport();

router.post("/register", handleRegister);

router.get("/failregister", handleFailRegister);

router.post("/login", handleLogin);

router.get("/faillogin", handleFailLogin);

router.post("/logout", handleLogout);

router.get("/restorePassword", (req, res) => {
  res.render("resPass");
});

router.post("/restorePassword", handleRestorePassword);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), handleGithubAuth);

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), handleGithubCallback);

router.get("/editprofile", handleEditProfileView);

router.post("/editprofile", handleEditProfile);

export default router;
