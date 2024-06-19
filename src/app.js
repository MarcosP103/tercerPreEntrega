import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import FileStore from 'session-file-store'
import bodyParser from "body-parser";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import MongoStore from "connect-mongo";
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import ProductManager from "./dao/manager/productManager.js";
import sessionsRouter from './routes/api/sessions.js'
import viewsRouter from './routes/views.router.js'
import indexRouter from "./routes/index.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import path from 'path'
import  {__dirname}  from "./utils.js";

//Cargar variables de entorno y conectar a MongoDB
dotenv.config()
connectDB()

//FileStore
const FileStoreInstance = FileStore(session)

const app = express();
const PORT = process.env.PORT

const httpServer = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

const socketServer = new Server(httpServer);
const productManager = new ProductManager();

// Middleware
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//Configuracion de la sesion
app.use(session({
  //store: new FileStoreInstance({path: './session', ttl: 100, retries: 0}),
  store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL_SESSION,
      ttl: 100
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 180 * 60 * 1000 },
}))

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Set up handlebars engine
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/sessions', sessionsRouter);
app.use("/", indexRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter)

app.get('/', (req, res) => {
  if(req.session.views) {
      req.session.views++
      res.send(`<p>Visitas: ${req.session.views}</p>`)
  } else {
      req.session.views = 1
      res.send('Bienvenido, contaremos tus visitas')
  }
  console.log("Session", req.session)
})

// Socket.io
let messages = []

socketServer.on("connection", socket => {
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
  socket.on("message", data => {
    messages.push(data)
    socketServer.emit("messageLogs", messages)
  })
});

export default app;