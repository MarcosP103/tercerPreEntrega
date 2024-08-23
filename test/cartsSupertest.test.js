import {expect} from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Testing Carts", () => {
  describe("Test de Carritos", () => {
    it("Debería crear un carrito correctamente", async () => {
      const response = await requester.post("/api/carts");
      const { statusCode, body } = response;

      console.log('Response body:', body)

      expect(statusCode).to.equal(201);
      expect(body).to.have.property("_id");
      expect(body.products).to.deep.equal([])
    });
    
    it("Debería agregar un producto al carrito", async () => {
      const createCart = await requester.post("/api/carts");
      const cartId = createCart.body._id;

      const productResponse = await requester.post("/api/products").send({
        title: "Producto Test",
        description: "Descripción del producto de prueba",
        code: 123,
        price: 50,
        status: true,
        stock: 100,
        category: "Test",
        thumbnails: "http://example.com/test.jpg",
      });

      const productId = productResponse.body._id;

      const quantity = 2;
      const addProductResponse = await requester
        .post(`/api/carts/${cartId}/products/${productId}`)
        .send({ quantity });

      const { statusCode, body } = addProductResponse;

      expect(statusCode).to.equal(201);
      expect(body.products).to.deep.include({
        productId: productId,
        quantity: quantity,
      });
    });

    it("Debería obtener un carrito por Id", async () => {
      const createCartResponse = await requester.post("/api/carts");
      const cartId = createCartResponse.body._id;

      const getResponse = await requester.get(`/api/carts/${cartId}`);
      const { statusCode, body } = getResponse;

      console.log("Get Cart Response Body:", body);

      expect(statusCode).to.equal(200);
      expect(body).to.have.property("_id", cartId);
    });

    it("Debería limpiar un carrito por Id", async () => {
      const createCartResponse = await requester.post("/api/carts");
      const cartId = createCartResponse.body._id;

      const clearCart = await requester.delete(`/api/carts/${cartId}`);
      const { statusCode, body } = clearCart;

      expect(statusCode).to.equal(200);
      expect(body.products).to.be.empty;
    });
  });
});
