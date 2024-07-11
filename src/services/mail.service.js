import nodemailer from 'nodemailer';
import path from 'path';
import { __dirname } from '../utils.js';

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "",
        pass: ""
    }
});

export const sendTestEmail = async () => {
    let result = await transport.sendMail({
        from: "",
        to: "",
        subject: "Prueba de funcionamiento",
        html: `
        <div>
            <h1>Correo de prueba -- body</h1>
            <img src="cid:pierre"/>
        </div>
        `,
        attachments: [{
            filename: "pierre.jpg",
            path: path.join(__dirname, '../public/pierre.jpg'), // Asegúrate de que la ruta del archivo sea correcta
            cid: "pierre"
        }]
    });
    return result;
};
