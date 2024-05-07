import { Router } from "express"
import ChatManager from "../utils/chatManager.js";

// INIT
const router = Router();
const chatManager = new ChatManager()

// ENDPOINTS
// Agregar mensaje
router.post("/", async (req, res) => {
    const io = req.app.get("io");
    const newMessage = req.body;
    try {
      const message = await chatManager.addMessage(newMessage);
      res.status(200).send({ payload: message });
  
    //   const messages = await chatManager.getMessages();
      io.emit("newMessage", { message: message });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
    }
  });

export default router