import { getProducts } from '../services/productsApi.service.js';

export const getAllProducts = async (req, res) => {
    try {
        const products = await getProducts();
        const userName = req.session.user ? `${req.session.user.first_name} ${req.session.user.last_name}` : 'Invitado';
        res.render('products', { userName, products });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
