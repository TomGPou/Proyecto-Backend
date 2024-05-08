import { Router } from "express"
import ChatManager from "../utils/chatManager.js";

//* INIT
const router = Router();
const chatManager = new ChatManager()

//* ENDPOINTS (/api/chat)
// Obtener mensajes
router.get('/', async (req, res) => {
  try {
    const messages = { messages: await chatManager.getMessages() };
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
      const message = await chatManager.addMessage(newMessage);
      res.status(200).send({ payload: message });
  
      const messages = await chatManager.getMessages();
      io.emit("newMessage", { messages: messages });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
    }
  });

export default router