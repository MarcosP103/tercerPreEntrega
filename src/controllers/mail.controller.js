import { sendProductAdded } from '../services/mail.service.js';

export const sendMail = async (req, res) => {
    try {
        let result = await sendProductAdded();
        res.send("Mensaje enviado");
    } catch (error) {
        res.status(500).send("Error al enviar el mensaje");
    }
};
