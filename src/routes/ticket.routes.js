//* IMPORTS
import { Router } from "express";
import TicketController from "../controllers/ticket.controller.js";
import {
  handlePolicies,
  verifyMongoId,
  handleError,
} from "../services/utils/utils.js";

//* INIT
const router = Router();
const ticketController = new TicketController();

//* ENDPOINTS (/api/ticket)
router.param("tid", verifyMongoId("tid"));

// GET ALL
router.get("/", handlePolicies(["ADMIN"]), async (req, res, next) => {
  try {
    const tickets = await ticketController.getAll();

    res.status(200).send({ payload: tickets });
  } catch (err) {
    next(err);
  }
});

// GET BY ID
router.get(
  "/:tid",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res, next) => {
    try {
      const ticket = await ticketController.getById(req.params.tid);

      res.status(200).send({ payload: ticket });
    } catch (err) {
      next(err);
    }
  }
);

// CREAR TICKET
router.post(
  "/",
  handlePolicies(["PREMIUM", "USER"]),
  async (req, res, next) => {
    try {
      const newTicket = await ticketController.create(req.body);

      res.status(200).send({ payload: newTicket });
    } catch (err) {
      next(err);
    }
  }
);

// ACTUALIZAR AMOUNT
router.put(
  "/:tid",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res, next) => {
    try {
      const ticket = await ticketController.updateAmount(
        req.params.tid,
        req.body.amount
      );

      res.status(200).send({ payload: ticket });
    } catch (err) {
      next(err);
    }
  }
);

// BORRAR TICKET
router.delete("/:tid", handlePolicies(["ADMIN"]), async (req, res, next) => {
  try {
    const ticket = await ticketController.delete(req.params.tid);

    res.status(200).send({ payload: ticket });
  } catch (err) {
    next(err);
  }
});

export default router;
