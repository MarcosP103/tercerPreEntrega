import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";
import MongoStore from "connect-mongo";
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import usersRouter from './routes/api/users.js'
import viewsRouter from './routes/views.router.js'
import indexRouter from "./routes/index.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import path from 'path'
import  {__dirname}  from "./utils.js";
import configureSocket from "./services/socket.service.js";
import mailRouter from "./routes/api/mail.router.js"
import loggerRoutes from "./routes/api/loggerW.routes.js";
import chatRouter from "./routes/chat.router.js"
import { setupSwaggerDocs } from "./config/swagger.config.js";
import { eq, getProperty, isAdmin, or } from "./utils/helpers.js"

//Cargar variables de entorno y conectar a MongoDB
dotenv.config()
connectDB()

const app = express();
const PORT = process.env.PORT || 8080

// Configuración Swagger
setupSwaggerDocs(app)

const httpServer = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

configureSocket(httpServer)

// Middleware
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

//Configuracion de la sesion
app.use(session({
  store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL_SESSION,
      ttl: 10800
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 180 * 60 * 1000, httpOnly: true },
}))

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Set up handlebars engine y helpers
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: { eq, getProperty, isAdmin, or }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


// Routes
app.use("/api/products", productsRouter);
app.use('/api/users', usersRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/mail", mailRouter)
app.use("/api/loggertest", loggerRoutes)
app.use("/chat", chatRouter)
app.use("/", viewsRouter)
app.use("/", indexRouter);

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

export default app;