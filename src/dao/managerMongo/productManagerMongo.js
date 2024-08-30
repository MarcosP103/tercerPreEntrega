import productModel from "../models/products.model.js";

class ProductManagerMongoose {
  constructor() {
    this.products = [];
  }

  async uploadProducts() {
    try {
      this.products = await productModel.find().lean();
      return this.products;
    } catch (error) {
      console.error("Error al cargar los productos.", error);
      throw error;
    }
  }

  async getProducts(limit = 0) {
    try {
      if (limit > 0) {
        return await productModel.find().limit(limit).lean();
      } else {
        return await productModel.find().lean();
      }
    } catch (error) {
      console.error("Error al obtener los productos: ", error);
      throw error;
    }
  }

  async addProduct(title, description, code, price, status, stock, category, thumbnails, owner, testProduct) {
    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
        console.log("Debe ingresar todos los campos");
        return;
    }
    try {
        const existProduct = await productModel.findOne({ code });
        if (existProduct) {
            console.log("El producto ya existe");
            return;
        }
    
        const newProduct = new productModel({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
            owner,
            testProduct,
        });

        await newProduct.save();
        console.log("Producto agregado correctamente", newProduct);

        return newProduct;
    } catch (error) {
        console.error("Error al agregar el producto: ", error);
        throw error;
    }
}


  async getProductsById(id) {
    try {
      const product = await productModel.findById(id).lean();
      if (!product) {
        console.log("No se encontró el producto segun el ID indicado");
        return null;
      }
      return product;
    } catch (error) {
      console.error("Error al obtener el producto por ID: ", error);
      throw error;
    }
  }

  async modProduct(id, productMod) {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        productMod,
        { new: true, lean: true }
      );

      if (!updatedProduct) {
        console.error("No se encontró el producto por ID");
        return null;
      }

      console.log("Se ha modificado correctamente");
      return updatedProduct;
    } catch (error) {
      console.error("Hubo un problema al actualizar", error);
      throw error;
    }
  }

  async delProduct(id) {
    try {
      const deletedProduct = await productModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        console.error("No se encontró el producto por ID", id);
        return null;
      }

      console.log("Producto eliminado correctamente");
      return deletedProduct;
    } catch (error) {
      console.error("Hubo un problema al eliminar", error);
      throw error;
    }
  }
}

export default ProductManagerMongoose;
