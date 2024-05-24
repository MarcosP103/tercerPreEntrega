import { Router } from "express";
import messageModel from "../dao/models/messages.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    let messages = await messageModel.find().lean();
    res.send({ result: "success", payload: messages });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ result: "error", message: "Error al cargar el chat" });
  }
});

router.post("/", async (req, res) => {
  let { user, message } = req.body;
  if (!message) {
    res.status(400).send({ status: "error", error: "Faltan parametros" });
  }

  let result = await messageModel.create({ user, message });
  res.send({ result: "success", payload: result })
});

router.put("/:chid", async (req, res) => {
  try {
    const { chid } = req.params;
    const { user, message } = req.body;

    if (!message) {
      return res
        .status(400)
        .send({ status: "error", error: "Faltan parametros." });
    }

    const updateMessage = await messageModel.findByIdAndUpdate(
      chid,
      { user, message },
      { new: true }
    );

    if (!updateMessage) {
      return res
        .status(404)
        .send({ status: "error", message: "Mensaje no encontrado" });
    }

    res.send({
      status: "success",
      message: "Mensaje actualizado",
      payload: updateMessage,
    });
  } catch (error) {
    console.error("Error al actualizar el mensaje.", error);
    res
      .status(500)
      .send({ status: "error", error: "Error al actualizar el mensaje." });
  }
});

router.delete("/:chid", async (req, res) => {
  try {
    const { chid } = req.params;
    await messageModel.findByIdAndDelete(chid);

    res.redirect("/chat");
  } catch (error) {
    console.error("Error al eliminar el mensaje.", error);
    res
      .status(500)
      .render({ status: "error", error: "Error al eliminar el mensaje." });
  }
});

export default router;
