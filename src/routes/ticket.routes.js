//* IMPORTS
import { Router } from "express";
import TicketController from "../controllers/ticket.controller.js";
import {
  handlePolicies,
  verifyMongoId,
  handleError,
} from "../services/utils/utils.js";
import errorsDictionary from "../services/errors/errrosDictionary.js";
import CustomError from "../services/errors/CustomErrors.class.js";

//* INIT
const router = Router();
const ticketController = new TicketController();

//* ENDPOINTS (/api/ticket)
router.param("tid", verifyMongoId("tid"));

// GET ALL
router.get("/", handlePolicies(["ADMIN"]), async (req, res) => {
  try {
    const tickets = await ticketController.getAll();
    if (tickets instanceof CustomError) {
      return handleError(req, res, tickets);
    } else {
      res.status(200).send({ payload: tickets });
    }
  } catch (err) {
    req.logger.error(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} ${err.message}`
    );
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

// GET BY ID
router.get(
  "/:tid",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res) => {
    try {
      const ticket = await ticketController.getById(req.params.tid);
      if (ticket instanceof CustomError) {
        return handleError(req, res, ticket);
      } else {
        res.status(200).send({ payload: ticket });
      }
    } catch (err) {
      req.logger.error(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ${err.message}`
      );
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
);

// CREAR TICKET
router.post("/", handlePolicies(["PREMIUM", "USER"]), async (req, res) => {
  try {
    const newTicket = await ticketController.create(req.body);
    if (newTicket instanceof CustomError) {
      return handleError(req, res, newTicket);
    } else {
      res.status(200).send({ payload: newTicket });
    }
  } catch (err) {
    req.logger.error(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} ${err.message}`
    );
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

// ACTUALIZAR AMOUNT
router.put("/:tid", handlePolicies(["USER", "PREMIUM"]), async (req, res) => {
  try {
    const ticket = await ticketController.updateAmount(
      req.params.tid,
      req.body.amount
    );
    if (ticket instanceof CustomError) {
      return handleError(req, res, ticket);
    } else {
      res.status(200).send({ payload: ticket });
    }
  } catch (err) {
    req.logger.error(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} ${err.message}`
    );
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

// BORRAR TICKET
router.delete("/:tid", handlePolicies(["ADMIN"]), async (req, res) => {
  try {
    const ticket = await ticketController.delete(req.params.tid);
    if (ticket instanceof CustomError) {
      return handleError(req, res, ticket);
    } else {
      res.status(200).send({ payload: ticket });
    }
  } catch (err) {
    req.logger.error(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} ${err.message}`
    );
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

export default router;
