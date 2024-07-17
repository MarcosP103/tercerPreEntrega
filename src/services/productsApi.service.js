import Product from '../dao/models/products.model.js';

export const getProducts = async () => {
    try {
        return await Product.find();
    } catch (error) {
        throw new Error('Error al obtener los productos');
    }
};
