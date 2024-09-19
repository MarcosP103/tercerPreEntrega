import { Router } from "express";
import { isPremium, isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const router = Router();

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", { products: [] });

});

router.get('/premium', isPremium, async (req, res) => {
  try {
    res.render('premium', { message: 'Página de administración: solo accesible para usuario premium' });
  } catch (error) {
    res.status(500).send("Error al cargar la página premium");
  }
});


router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('login');
});

router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('register');
});

router.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile', { user: req.user });
});

router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

export default router;
