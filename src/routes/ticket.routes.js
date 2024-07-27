//* IMPORTS
import { Router } from "express";
import TicketController from "../controllers/ticket.controller.js";
import { handlePolicies, verifyMongoId } from "../services/utils/utils.js";
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
    handleResponse(req, res, tickets);
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
      handleResponse(req, res, ticket);
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
    handleResponse(req, res, newTicket);
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
    handleResponse(req, res, ticket);
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
    handleResponse(req, res, ticket);
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
