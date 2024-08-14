import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path'; 
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerOptionUsers = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de Usuarios',
            description: 'API Users'
        },
    },
    apis: [resolve(__dirname, '../docs/Users/Users.yaml')],  
}

const swaggerOptionProducts = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de Productos',
            description: 'API Productos'
        },
    },
    apis: [resolve(__dirname, '../docs/Products/Products.yaml')],
}

const swaggerOptionCarts = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de Carts',
            description: 'API Carts'
        },
    },
    apis: [resolve(__dirname, '../docs/Carts/Carts.yaml')],
}

const swaggerSpecUsers = swaggerJSDoc(swaggerOptionUsers);
const swaggerSpecProducts = swaggerJSDoc(swaggerOptionProducts);
const swaggerSpecCarts = swaggerJSDoc(swaggerOptionCarts);

export const setupSwaggerDocs = (app) => {
    app.use('/api-docs-users', swaggerUiExpress.serveFiles(swaggerSpecUsers, {}), swaggerUiExpress.setup(swaggerSpecUsers));
    app.use('/api-docs-products', swaggerUiExpress.serveFiles(swaggerSpecProducts, {}), swaggerUiExpress.setup(swaggerSpecProducts));
    app.use('/api-docs-carts', swaggerUiExpress.serveFiles(swaggerSpecCarts, {}), swaggerUiExpress.setup(swaggerSpecCarts));
};
