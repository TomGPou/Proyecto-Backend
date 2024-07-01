//* IMPORTS
import { Router } from "express";
import { addMessage, getChat } from "../controllers/messages.controller.js";

//* INIT
const router = Router();

//* ENDPOINTS (/api/chat)
// Obtener mensajes
router.get("/", async (req, res) => {
  try {
    const messages = { messages: await getChat() };
    res.status(200).send({ payload: messages });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

// Agregar mensaje
router.post("/", async (req, res) => {
  const io = req.app.get("io");
  const newMessage = req.body;
  try {
    const message = await addMessage(newMessage);
    res.status(200).send({ payload: message });

    const messages = await getChat();
    io.emit("newMessage", { messages: messages });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

export default router;
