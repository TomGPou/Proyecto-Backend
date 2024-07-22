//* IMPORTS
import { Router } from "express";
import TicketController from "../controllers/ticket.controller.js";
import { handlePolicies, verifyMongoId } from "../services/utils/utils.js";
import CustomError from "../services/errors/CustomErrors.class.js";
import errorsDictionary from "../services/errors/errrosDictionary.js";

//* INIT
const router = Router();
const ticketController = new TicketController();

//* ENDPOINTS (/api/ticket)
router.param("tid", verifyMongoId("tid"));

// GET ALL
router.get("/", handlePolicies(["ADMIN"]), async (req, res) => {
  try {
    const tickets = await ticketController.getAll();
    res.status(200).send({ payload: tickets });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.status).send({ error: err.message });
    } else {
      console.error(err);
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
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
    } catch (err) {
      if (err instanceof CustomError) {
        res.status(err.status).send({ error: err.message });
      } else {
        console.error(err);
        res
          .status(500)
          .send({ error: errorsDictionary.UNHANDLED_ERROR.message });
      }
    }
  }
);

// CREAR TICKET
router.post("/", handlePolicies(["PREMIUM", "USER"]), async (req, res) => {
  try {
    const newTicket = await ticketController.create(req.body);
    res.status(200).send({ payload: newTicket });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.status).send({ error: err.message });
    } else {
      console.error(err);
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
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
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.status).send({ error: err.message });
    } else {
      console.error(err);
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
});

// BORRAR TICKET
router.delete("/:tid", handlePolicies(["ADMIN"]), async (req, res) => {
  try {
    const ticket = await ticketController.delete(req.params.tid);
    res.status(200).send({ payload: ticket });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.status).send({ error: err.message });
    } else {
      console.error(err);
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
});

export default router;
