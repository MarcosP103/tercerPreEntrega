import mongoose from "mongoose";
import assert from "assert";
import * as productService from "../src/services/products.service.js";
import productModel from "../src/dao/models/products.model.js";
import userModel from "../src/dao/models/user.model.js"

describe("Product Service Tests", () => {
  let userId

  before(async () => {
    await mongoose.connect('mongodb+srv://mperezro103:eccomerce24@cluster0.9wfhadf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    
    await userModel.deleteOne({ email: 'premiumuser@pro.com' });

    const user = await userModel.create({
      first_name: 'Premium',
      last_name: 'User',
      email: 'premiumuser@pro.com',
      age: 30,
      password: '123456',
      role: 'premium',
    })
    userId = user._id  
  })
  beforeEach(async () => {
    await productModel.deleteMany({ testProduct: true });
  });   

  it("Debería obtener todos los productos de la base de datos", async function() {
    this.timeout(5000);
    try {
      const products = await productService.getProducts();
      assert.strictEqual(Array.isArray(products.docs), true);
      assert.strictEqual(products.docs.length >= 0, true);
    } catch (error) {
      console.error("Error durante el test", error);
      assert.fail("Test Fallido con errores");
    }
  });

  it("Debería agregar un nuevo producto", async () => {
    const newProduct = {
      title: "Producto1",
      description: "Producto1 description",
      code: 99,
      price: 100,
      status: true,
      stock: 50,
      category: "Una categoria",
      thumbnails: "http://example.com/test.jpg",
      owner: userId,
      testProduct: true,
    };

    const addedProduct = await productService.addProduct(
      newProduct.title,
      newProduct.description,
      newProduct.code,
      newProduct.price,
      newProduct.status,
      newProduct.stock,
      newProduct.category,
      newProduct.thumbnails,
      newProduct.owner,
      newProduct.testProduct
    );

    console.log("Added Product:", addedProduct);

    assert.strictEqual(addedProduct.title, newProduct.title);
    assert.ok(addedProduct._id);
  });

  it("Debería modificar un producto existente por ID", async () => {
    // Primero, agregar un producto para modificarlo
    const productToModify = new productModel({
      title: "Producto a modificar",
      description: "Descripcion inicial",
      code: 88,
      price: 100,
      status: true,
      stock: 50,
      category: "Categoria inicial",
      thumbnails: "http://example.com/initial.jpg",
      owner: userId,
    });
    await productToModify.save();

    const updatedData = {
      title: "Modified Product",
      description: "Updated Description",
      price: 200,
      status: false,
      stock: 100,
      category: "Updated Category",
      thumbnails: "http://example.com/updated.jpg",
      owner: userId,
    };

    const updatedProduct = await productService.updateProduct(
      productToModify._id,
      updatedData
    );

    assert.strictEqual(updatedProduct.title, updatedData.title);
    assert.strictEqual(updatedProduct.description, updatedData.description);
    assert.strictEqual(updatedProduct.price, updatedData.price);
    assert.strictEqual(updatedProduct.status, updatedData.status);
    assert.strictEqual(updatedProduct.stock, updatedData.stock);
    assert.strictEqual(updatedProduct.category, updatedData.category);
  });

  it("Debería eliminar un producto existente por ID", async () => {
    // Primero, agregar un producto para eliminarlo
    const productToDelete = new productModel({
      title: "Producto a eliminar",
      description: "Descripcion a eliminar",
      code: 77,
      price: 100,
      status: true,
      stock: 50,
      category: "Categoria a eliminar",
      thumbnails: "http://example.com/delete.jpg",
      owner: userId,
    });
    await productToDelete.save();

    const deleteResult = await productService.deleteProduct(
      productToDelete._id);
    assert.ok(deleteResult);

    // Verificar que el producto fue eliminado
    const deletedProduct = await productModel.findById(productToDelete._id);
    assert.strictEqual(deletedProduct, null);
  });
});
