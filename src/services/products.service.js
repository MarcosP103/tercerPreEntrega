import productModel from '../dao/models/products.model.js';
import ProductManagerMongoose from '../dao/managerMongo/productManagerMongo.js';
import mongoose from 'mongoose';

const productManager = new ProductManagerMongoose();

export const getRealTimeProducts = async () => {
  return await productManager.uploadProducts();
};

export const getProducts = async (limit, page, sort, query) => {
  limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;
  sort = sort || '';
  query = query || '';

  let filter = {};

  if (query) {
    const categoryRegex = new RegExp(`^${query}$`, 'i');
    filter = { category: categoryRegex };
  }

  let options = {
    page: page,
    limit: limit,
    sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    lean: true
  };

  return await productModel.paginate(filter, options);
};


export const getProductById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error('ID inválido');
  }

  const product = await productModel.findById(id);
  if(!product) {
    throw new Error('Producto no encontrado')
  }
  return product
};

export const addProduct = async (title, description, code, price, status, stock, category, thumbnails, owner, testProduct) => {
  return await productManager.addProduct(title, description, code, price, status, stock, category, thumbnails, owner, testProduct);
};

export const updateProduct = async (id, productMod) => {
  return await productManager.modProduct(id, productMod);
};

export const deleteProduct = async (id) => {
  return await productManager.delProduct(id);
};
