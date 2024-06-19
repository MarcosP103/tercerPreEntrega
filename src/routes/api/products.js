import { Router } from 'express';
import Product from '../../models/products.model.js';
import { isAuthenticated } from '../../middleware/auth.js'

const router = Router();

router.get('/', isAuthenticated, async (req, res) => {
    console.log('Session', req.session)
    try {
        const products = await Product.find(); 
        const userName = req.session.user ? `${req.session.user.first_name} ${req.session.user.last_name}` : 'Invitado';
        res.render('products', { userName, products });
    } catch (err) {
        res.status(500).send('Error al obtener los productos');
    }
});

export default router;