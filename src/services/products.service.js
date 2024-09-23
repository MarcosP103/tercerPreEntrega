import productModel from '../dao/models/products.model.js';
import ProductManagerMongoose from '../dao/managerMongo/productManagerMongo.js';
import mongoose from 'mongoose';
import { sendProductDeletedEmail } from '../services/mail.service.js'
import userModel from '../dao/models/user.model.js';

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
    filter = {
      $or: [
        { category: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } }
      ]
  }}

  let options = {
    page: page,
    limit: limit,
    sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    lean: true
  };

  const result = await productModel.paginate(filter, options);
  console.log("Paginate result:", result); 
  return result
};


export const getProductById = async (id) => {
  console.log('Verificando Id:', id)
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
  try {
    return await productManager.addProduct(title, description, code, price, status, stock, category, thumbnails, owner, testProduct);
  } catch (error) {
    console.error('Error al agregar el producto en el servicio:', error);
    throw error;
  }
};

export const updateProduct = async (id, productMod) => {
  try {
    if (productMod.owner) {
      const user = await userModel.findOne({ email: productMod.owner });

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      productMod.owner = user._id;

      delete productMod.owner;
    }

    return await productManager.modProduct(id, productMod);
  } catch (error) {
    console.error('Error al modificar el producto:', error);
    throw error;
  } 
};

export const deleteProduct = async (pid, userEmail) => {
  try {
    const product = await getProductById(pid)
    if(!product) {
      return { success: false, status: 404, message: "Producto no encontrado."}
    }

    if (product.owner && product.owner !== userEmail) {
      try {
        await sendProductDeletedEmail(product.owner, product.title, userEmail);
      } catch (emailError) {
        console.error("Error al enviar el correo: ", emailError);
      }
    }

    const productDeleted = await productManager.delProduct(pid);
    if (!productDeleted) {
      return { success: false, status: 500, message: "Error al eliminar el producto." };
    }

    return { success: true, product: productDeleted };
    
  } catch (error) {
    console.error("Error al eliminar el producto: ", error);
    return { success: false, status: 500, message: "Error al eliminar el producto." };
  }
};
