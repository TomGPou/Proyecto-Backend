//* IMPORTS
import { Router } from "express";
import MessagesController from "../controllers/messages.controller.js";
import { handlePolicies } from "../services/utils/utils.js";
import CustomError from "../services/errors/CustomErrors.class.js";
import errorsDictionary from "../services/errors/errrosDictionary.js";

//* INIT
const router = Router();
const messagesController = new MessagesController();

//* ENDPOINTS (/api/chat)
// Obtener mensajes
router.get(
  "/",
  handlePolicies(["PREMIUM", "USER", "ADMIN"]),
  async (req, res) => {
    try {
      const messages = { messages: await messagesController.getChat() };
      res.status(200).send({ payload: messages });
    } catch (err) {
      req.logger.error(
        `${new Date().toDateString()} ${req.method} ${req.url} ${err.message}`
      );
      if (err instanceof CustomError) {
        res.status(err.status).send({ error: err.message });
      } else {
        res
          .status(500)
          .send({ error: errorsDictionary.UNHANDLED_ERROR.message });
      }
    }
  }
);

// Agregar mensaje
router.post("/", handlePolicies(["USER", "PREMIUM"]), async (req, res) => {
  const io = req.app.get("io");
  const newMessage = req.body;
  try {
    const message = await messagesController.add(newMessage);
    res.status(200).send({ payload: message });

    const messages = await messagesController.getChat();
    io.emit("newMessage", { messages: messages });
  } catch (err) {
    req.logger.error(
      `${new Date().toDateString()} ${req.method} ${req.url} ${err.message}`
    );
    if (err instanceof CustomError) {
      res.status(err.status).send({ error: err.message });
    } else {
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
});

export default router;
