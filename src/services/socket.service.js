import { Server } from "socket.io";
import ProductManager from "../dao/manager/productManager.js";

const productManager = new ProductManager();
let messages = [];

export default function configureSocket(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
    console.log("Cliente conectado, mensaje Socket");

    productManager.uploadProducts().then((products) => {
      socket.emit("products", products);
    });

    socket.on("newProduct", (product) => {
      productManager
        .addProduct(
          product.title,
          product.description,
          product.code,
          product.price,
          product.status,
          product.stock,
          product.category,
          product.thumbnails
        )
        .then(() => {
          return productManager.uploadProducts();
        })
        .then((products) => {
          socket.emit("products", products);
          socket.emit("response", "Producto agregado correctamente");
        })
        .catch((error) =>
          socket.emit(
            "response",
            "Error al agregar el producto deseado" + error.message
          )
        );
    });

    socket.on("delProduct", (pid) => {
      productManager
        .delProduct(pid)
        .then(() => {
          return productManager.delProduct();
        })
        .then((products) => {
          socket.emit("products", products);
          socket.emit("responseDel", "Producto borrado correctamente");
        })
        .catch((error) =>
          socket.emit(
            "responseDel",
            "Error al borrar el producto deseado" + error.message
          )
        );
    });

    socket.on("message", (data) => {
      messages.push(data);
      socketServer.emit("messageLogs", messages);
    });
  });

  return socketServer;
}
