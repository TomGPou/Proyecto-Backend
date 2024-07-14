//* IMPORTS
import { Router } from "express";
import TicketController from "../controllers/ticket.controller.js";
import { handlePolicies } from "../services/utils/utils.js";

//* INIT
const router = Router();
const ticketController = new TicketController();

//* ENDPOINTS (/api/tickets)
router.param("tid", async (req, res, next, tid) => {
  if (config.MONGODB_ID_REGEX.test(tid)) {
    next();
  } else {
    res.status(400).send({
      origin: config.SERVER,
      payload: null,
      error: "Id del ticket no válido",
    });
  }
});

// GET ALL
router.get("/", handlePolicies(["ADMIN"]), async (req, res) => {
  try {
    const tickets = await ticketController.getAll();
    res.status(200).send({ payload: tickets });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// GET BY ID
router.get(
  "/:tid",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res) => {
    try {
      const ticket = await ticketController.getById(req.params.tid);
      res.status(200).send({ payload: ticket });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
    }
  }
);

// CREAR TICKET
router.post("/", handlePolicies(["PREMIUM", "USER"]), async (req, res) => {
  try {
    const newTicket = await ticketController.create(req.body);
    res.status(200).send({ payload: newTicket });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// ACTUALIZAR AMOUNT
router.put("/:tid", handlePolicies(["USER", "PREMIUM"]), async (req, res) => {
  try {
    const ticket = await ticketController.updateAmount(
      req.params.tid,
      req.body.amount
    );
    res.status(200).send({ payload: ticket });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// BORRAR TICKET
router.delete("/:tid", handlePolicies(["ADMIN"]), async (req, res) => {
  try {
    const ticket = await ticketController.delete(req.params.tid);
    res.status(200).send({ payload: ticket });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

export default router;
