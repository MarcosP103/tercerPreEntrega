import express from "express";
import { path, __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./manager/productManager.js";
import products from "./manager/DB.json";
import viewsRouter from "./routes/views.router.js";
import prodsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
const socketServer = new Server(httpServer);

const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

app.use("/api/products", prodsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

socketServer.on("connection", (socket) => {
  console.log("Cliente conectado");

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
        return productManager.uploadProducts();
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
});
