# Carrito de compra

Este proyecto implementa un sistema de gestión de carritos de compra utilizando Express, Node.js y WebSocket y Handlebars. Está configurado para escuchar el puerto 8080 y cuenta con dos grupos de rutas: **/products y /carts**. Permite al usuario crear, agregar productos y ver el contenido de los carritos de compra.
Todo el proyecto trabaja con Promises y persistencia de información implementando FileSystem.

# Instalación y creación de carpetas

Se optó por crear dos carpetas principales. La primera se llama 'manager' donde se encuentran los archivos .json con la información relacionada a los productos y los carritos. Y el productManager.js donde se encuentra la class con dicho nombre y los metodos necesarios para poder operar.
Por otro lado se encuentra la carpeta 'src' con el archivo 'app.js' y la carpeta 'routes' con los archivos, 'products.router.js' y 'carts.router.js'

Para comenzar a crear el proyecto se procedio en primera instancia por ejecutar los comandos **npm install -y** y **npm install express**. 
El primero instala las dependencias en el archivo 'package.json'y el segundo es para instalar el framework.
Además se hizo uso de una librería uuid la cual crea números unicos, la cual se instaló de la siguiente forma **npm install uuid**.
Para darle interaccion entre el navegador del usuario y el servidor se implementó WebSocket con **npm install socket.io**

Debido a esta última tecnología las importaciones comenzaron a realizarse de forma distinta, pasando de 'require' a 'import'

## App.js

1. Importación de módulos:
- express
- path
- server
- handlebars

2. Creación de la aplicacion Express:
- app = express ()
3. Manejo de rutas con routers:
- prodsRouter = require("./routes/products.router.js")
-  cartsRouter = require("./routes/carts.router.js") 
- app.use("/", prodsRouter)
- app.use("/", cartsRouter)
4. Configuración del puerto:
- const PORT = 8080
5. Configuración de Middleware:
- app.use(express.json())
- app.use(express.urlencoded)
6. Inicializar el servidor:
-app.listen(PORT)

## ProductRoutes
1. Importación de módulos:
-const express = require("express")
-const router = express.Router
-const fs = require("fs").promises
2. Creación de una instancia ProductManager:
-const ProductManager = require
-const productManager = new ProductManager

Se precisaba crear los endpoint GET, POST, PUT y DELETE
 -  **GET**, se indicó que listara todos los productos alojados en DB.json agregando que se pueda establecer un limite. Esto se llevó a cabo mediante la variable 'limit'.
Por otro lado la ruta GET /:pid muestra solo el producto según el id indicado.
-  **POST**, sólo se agrega el producto con los campos: id, title, description, code, price, status, stock, category y thumbnails. 
Se realizan las validaciones correspondientes para asegurar que los campos sean de determinado tipo con 'validateType' y que el id se autoincremente con 'lastProductId'.
Además se asegura que el status sea por defecto TRUE con la constante 'defaultStatus'.
- **PUT**, este endpoint toma un producto según su ID y los actualiza desde Body donde se valida que el ID no debe modificar o eliminar tras la actualización.
- **DELETE**, se indica el ID del producto a eliminar.


## CartsRoutes
1. Nuevamente se realizaron importaciones de Express, Routes y FileSystem.
2. Se agregaron los endpoints GET y POST.
- **POST**, la ruta raíz POST crea un nuevo carrito que cuenta unicamente con los campos id y products. El 'ID' se auto genera mediante la función 'generateId' la cual a traves de Math.random devuelve siempre un numero al azar. En el caso de 'products' se trata de un array con objetos que representan cada producto seleccionado.
- Además nos encontramos con una ruta POST que agrega un producto al array 'products' del carrito seleccionado por su 'ID' y que tiene una variable 'quantity' que contiene el numero de ejemplares de dicho producto. En este endpoint se valida que 'product' solo contenga el ID del producto y que 'quantity' se sume en caso de ser necesario.
- **GET**, esta ruta llamada por un 'ID' de carrito lista los productos correspondientes a ese carrito.







