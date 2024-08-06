import nodemailer from 'nodemailer';
import path from 'path';
import { __dirname } from '../utils.js';

const transport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});  

export const sendProductAdded = async (userEmail, product) => {
    let result = await transport.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Producto agregado al carrito",
        html: `
        <div>
            <h1>Se ha agregado un nuevo producto a tu carrito</h1>
            <p>Producto: ${product.title}</p>
            <p>Descripcion: ${product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Cantidad: ${product.quantity}</p>
        </div>
        `
    });
    return result;
};
