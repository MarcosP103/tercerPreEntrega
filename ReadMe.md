# Plataforma Ecommerce - PetShop 

Este proyecto es una plataforma de ecommerce de una tienda de mascotas (PetShop) desarrollada en JavaScript con Node.js y Express. Utiliza una arquitectura por capas y módulos ES (`type: module`) para mejorar la organización y escalabilidad del código. 


## Tabla de Contenidos 

- [Características](#características) 

- [Instalación](#instalación) 

- [Uso](#uso) 

- [Arquitectura](#arquitectura) 

- [Rutas](#rutas) 

- [Tecnologías Utilizadas](#tecnologías-utilizadas) 

- [Variables de Entorno](#variables-de-entorno) 

- [Dependencias](#dependencias) 

- [Contribuciones](#contribuciones) 

- [Licencia](#licencia) 

  

## Características 

- **Autenticación de usuarios** con Passport.js (soporte para estrategias locales y GitHub). 

- **Control de acceso basado en roles**: existen tres tipos de usuarios (`user`, `premium`, `admin`). 

  - `user`: Solo puede comprar productos. 

  - `premium`: Puede agregar, modificar y eliminar productos. Los productos llevan el email del usuario que los publicó. 

  - `admin`: Tiene los mismos permisos que un `premium` y además puede eliminar usuarios o cambiar su rol. 

- **Gestión de productos**: Los usuarios con rol `premium` o `admin` pueden agregar, modificar y eliminar productos. 

- **Gestión de carrito de compras**: Añadir productos, actualizar cantidad, eliminar y proceder a la compra. 

- **Chat en tiempo real**: Al ingresar, si el usuario no está logueado, se le solicita un nombre para poder participar del chat. 

- **Paginación**: Se muestran solo 10 productos por página. Los usuarios no logueados no pueden acceder al detalle de los productos. 

- **Modificación de datos personales**: Todos los usuarios pueden modificar su información personal, pero solo el usuario `user` puede cambiar su rol a `premium` mediante la subida de tres comprobantes. 

- **Documentación de API** con Swagger. 

- **Notificaciones por correo electrónico** con Nodemailer. 

- **Persistencia de sesiones** utilizando MongoDB. 

- **Sistema de logs** con Winston. 

  

## Instalación 

1. Clonar el repositorio: 

    ```bash 

    git clone https://github.com/tu-usuario/ecommerce-petshop.git 

    cd ecommerce-petshop 

    ``` 

2. Instalar dependencias:   

    ```bash 

    npm install 

    ``` 

3. Iniciar la aplicación:   

    ```bash 

    npm run dev 

    ``` 


## Uso 

Una vez que la aplicación esté en funcionamiento, abre tu navegador y dirígete a `http://localhost:3000`. Podrás navegar por la tienda de mascotas, ver productos, gestionar tu carrito de compras y, si estás autenticado, interactuar con el chat en tiempo real. 

Además, puedes acceder a la documentación de la API visitando `http://localhost:3000/api-docs`. 

  
### Tipos de usuarios 

- **user**: Solo puede comprar productos. Puede cambiar su rol a `premium` subiendo tres archivos (comprobantes). 

- **premium**: Puede agregar, modificar y eliminar productos. Los productos publicados por un usuario premium llevan su correo electrónico como referencia. No puede cambiar su rol. 

- **admin**: Tiene los mismos permisos que el `premium`, pero además puede eliminar usuarios o cambiar su rol. No puede cambiar su propio rol. 

  

## Arquitectura

El proyecto sigue una **arquitectura por capas**, separando el código en distintas capas para mejorar la mantenibilidad y escalabilidad: 


- **Capa de Modelo**: Define los esquemas y estructuras de datos con Mongoose (por ejemplo, `products.model.js`, `user.model.js`). 

- **Capa de Servicio**: Contiene la lógica de negocio e interactúa con los modelos (por ejemplo, `products.service.js`, `user.service.js`). 

- **Capa de Controladores**: Maneja las solicitudes HTTP entrantes, procesa los datos a través de los servicios y devuelve respuestas (por ejemplo, `products.controller.js`, `user.controller.js`). 

- **Capa de Rutas**: Define las rutas de la API y las vincula con los controladores correspondientes (por ejemplo, `products.router.js`, `users.router.js`). 

  

## Rutas 

### Rutas de la API: 

- `GET /api/products`: Obtiene todos los productos (paginados, 10 productos por página). 

- `GET /api/products/:id`: Obtiene un producto por su ID. 

- `POST /api/products`: Crea un nuevo producto (requiere rol `premium` o `admin`). 

- `PUT /api/products/:id`: Actualiza un producto por su ID. 

- `DELETE /api/products/:id`: Elimina un producto por su ID. 

  

- `POST /api/users`: Registra un nuevo usuario. 

- `POST /api/users/login`: Inicia sesión. 

  

- `POST /api/carts`: Crea un nuevo carrito de compras. 

- `GET /api/carts/:id`: Obtiene un carrito por su ID. 

- `POST /api/carts/:id/products`: Añade un producto al carrito. 

- `DELETE /api/carts/:id`: Vacía el carrito de compras. 

  

- `POST /api/mail`: Envía detalles de la compra por correo. 

  

### Rutas de Vistas: 

- `/`: Página principal. 

- `/products`: Ver todos los productos. 

- `/profile`: Perfil de usuario y gestión de rol. 

- `/cart`: Visualizar y gestionar el carrito de compras. 

  

## Tecnologías Utilizadas 

- **Node.js**: Entorno de ejecución para JavaScript. 

- **Express.js**: Framework web para Node.js. 

- **MongoDB**: Base de datos NoSQL para almacenar datos. 

- **Mongoose**: ODM para MongoDB. 

- **Passport.js**: Middleware de autenticación. 

- **Socket.io**: Comunicación en tiempo real para el chat. 

- **Handlebars.js**: Motor de plantillas para la renderización de vistas. 

- **Swagger**: Herramienta para la documentación de API. 

- **Nodemailer**: Servicio para el envío de correos electrónicos. 

- **Multer**: Middleware para la subida de archivos. 

- **Winston**: Registro de eventos del sistema. 

  

## Variables de Entorno 

Para ejecutar este proyecto, necesitarás configurar las siguientes variables de entorno en un archivo `.env`: 

- `PORT`: El puerto en el que se ejecutará el servidor (por defecto: 8080). 

- `MONGO_URL`: Cadena de conexión a MongoDB. 

- `MONGO_URL_SESSION`: Cadena de conexión a MongoDB.

- `SESSION_SECRET`: Secreto para la gestión de sesiones. 

- `PERSISTANCE`: Elección del modelo de persistencia

- `EMAIL_SERVICE`: Servicio para envío de correo, en este caso Gmail. 

- `EMAIL_USER`: Email de usuario. 

- `EMAIL_PASS`: Password para poder operar.

- `BASE_URL`: Para el reseteo de password. 

- `MONGO_URL_TEST`: Para testing.

  

## Dependencias 

A continuación se listan las principales dependencias utilizadas en este proyecto, como se especifica en `package.json`: 

- **bcryptjs**: ^2.4.3 

- **body-parser**: ^1.20.2 

- **bootstrap**: ^5.3.3 

- **chai**: ^5.1.1 

- **connect-mongo**: ^5.1.0 

- **cookie-parser**: ^1.4.6 

- **dotenv**: ^16.4.5 

- **express**: ^4.19.2 

- **express-handlebars**: ^7.1.2 

- **express-session**: ^1.18.0 

- **mocha**: ^10.7.3 

- **mongodb**: ^6.6.2 

- **mongoose**: ^8.4.0 

- **mongoose-paginate-v2**: ^1.8.1 

- **multer**: ^1.4.5-lts.1 

- **nodemailer**: ^6.9.14 

- **nodemon**: ^3.1.4 

- **passport**: ^0.7.0 

- **passport-github2**: ^0.1.12 

- **passport-local**: ^1.0.0 

- **session-file-store**: ^1.5.0 

- **socket.io**: ^4.7.5 

- **supertest**: ^7.0.0 

- **swagger-jsdoc**: ^6.2.8 

- **swagger-ui-express**: ^5.0.1 

- **sweetalert2**: ^11.11.0 

- **uuid**: ^9.0.1 

- **winston**: ^3.13.1 

  

## Scripts 

Puedes utilizar los siguientes scripts de npm para ejecutar el proyecto: 

- `npm start`: Iniciar la aplicación. 

- `npm run dev`: Inicia la aplicación en modo desarrollo.   

- `npm test`: Ejecuta las pruebas con Mocha y Chai.  


## Contribuciones  

¡Las contribuciones son bienvenidas! Si tienes alguna mejora o encuentras errores, no dudes en enviar un pull request.  


## Licencia Este proyecto está bajo la Licencia MIT. 