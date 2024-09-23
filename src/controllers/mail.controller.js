import {
  sendProductAdded,
  sendPurchaseConfirm,
  sendAccountDeletionEmail,
  sendProductDeletedEmail,
} from "../services/mail.service.js";

export const sendMail = async (req, res) => {
  try {
    const { userEmail, product } = req.body;
    let result = await sendProductAdded(userEmail, product);
    res.status(200).send("Correo de cambio contraseña enviado.");
  } catch (error) {
    res.status(500).send("Error al enviar el mensaje");
  }
};

export const sendPurchaseConfirmMail = async (req, res) => {
  try {
    const { userEmail, ticket } = req.body;
    let result = await sendPurchaseConfirm(userEmail, ticket);
    res.status(200).send("Correo de confirmación de compra enviado.");
  } catch (error) {
    console.error("Error al enviar correo de confirmación de compra:", error);
    res.status(500).send("Error al enviar el correo de confirmación.");
  }
};

export const sendAccountDeletionMail = async (req, res) => {
  try {
    const { userEmail } = req.body;
    let result = await sendAccountDeletionEmail(userEmail);
    res.status(200).send("Correo de eliminación de cuenta enviado.");
  } catch (error) {
    console.error("Error al enviar correo de eliminación de cuenta:", error);
    res.status(500).send("Error al enviar el correo de eliminación.");
  }
};

export const sendProductDeletedEmailF = async (req, res) => {
    const { ownerEmail, productName, deleterEmail } = req.body
    try {
        await sendProductDeletedEmail(ownerEmail, productName, deleterEmail)
        res.status(200).json({ message: "Correo enviado correctamente." })
    } catch (error) {
        console.error("Error en el controlador de correo: ", error)
        res.status(500).json({ error: "Error al enviar el correo." })
    }
}