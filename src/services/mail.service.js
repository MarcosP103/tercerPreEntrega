import nodemailer from 'nodemailer';
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
    try {
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
    } catch (error) {
        console.error("Error al enviar el correo.", error)
        throw new Error("Error al enviar el correo.")
    }
};

export const sendPurchaseConfirm = async (userEmail, ticket) => {
    try {
        let result = await transport.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Confirmación de compra",
            html: `
            <div>
                <h1>Gracias por tu compra</h1>
                <p>Hemos procesado tu pedido con éxito.</p>
                <p><strong>Ticket Id:</strong> ${ticket.code}</p>
                <p><strong>Total pagado:</strong> ${ticket.amount.toFixed(2)}</p>
                <p><strong>Productos:</strong></p>
                <ul>
                    ${ticket.products.map(item => `
                        <li>${item.title} - Cantidad: ${item.quantity} - Precio: $${item.price.toFixed(2)}</li>
                    `).join('')}
                </ul>
                <p>Gracias por tu preferencia.</p>
            </div>`
        })
        return result
    } catch (error) {
        console.error("Error al enviar el correo.", error)
        throw new Error("Error al enviar el correo.")
    }
}

export const sendAccountDeletionEmail = async (userEmail) => {
    try {
        let result = await transport.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Alerta eliminacion de su cuenta en 'Tu PetShop'.",
            html: `
            <div>
                <h1>Se ha eliminado su cuenta por inactividad.</h1>
                <p>Usuario: ${user.first_name}</p>
                <p>Ultima conexión: ${user.last_connection.toISOString()}</p>
                
            </div>
            `
        });
        return result;
    } catch (error) {
        console.error("Error al enviar el correo.", error)
        throw new Error("Error al enviar el correo.")
    }
}

export const sendProductDeletedEmail = async (ownerEmail, productName, deleterEmail) => {
    try {
        let result = await transport.sendMail({
            from: process.env.EMAIL_USER,
            to: ownerEmail,
            subject: "Tu producto ha sido eliminado.",
            html: `
            <div>
                <h1>Uno de tus productos se ha eliminado.</h1>
                <p>Producto: ${productName}</p>
                <p>Usuario que lo eliminó: ${deleterEmail}</p>
            </div>
            `
        });
        return result;
    } catch (error) {
        console.error("Error al enviar el correo.", error)
        throw new Error("Error al enviar el correo.")
    }
}