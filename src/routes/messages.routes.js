//* IMPORTS
import { Router } from "express";
import MessagesController from "../controllers/messages.controller.js";
import { handlePolicies } from "../services/utils/utils.js";

//* INIT
const router = Router();
const messagesController = new MessagesController();

//* ENDPOINTS (/api/chat)
// Obtener mensajes
router.get(
  "/",
  handlePolicies(["PREMIUM", "USER", "ADMIN"]),
  async (req, res, next) => {
    try {
      const messages = { messages: await messagesController.getChat() };
      res.status(200).send({ payload: messages });
    } catch (err) {
      next(err);
    }
  }
);

// Agregar mensaje
router.post(
  "/",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res, next) => {
    const io = req.app.get("io");
    const newMessage = req.body;
    try {
      const message = await messagesController.add(newMessage);
      res.status(200).send({ payload: message });

      const messages = await messagesController.getChat();
      io.emit("newMessage", { messages: messages });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
