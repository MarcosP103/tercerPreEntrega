import nodemailer from 'nodemailer';
import path from 'path';
import { __dirname } from '../utils.js';

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "mperezro103@gmail.com",
        pass: "eoar yqrs pjkt bzss"
    }
});

export const sendProductAdded = async (userEmail, product) => {
    let result = await transport.sendMail({
        from: "mperezro103@gmail.com",
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
