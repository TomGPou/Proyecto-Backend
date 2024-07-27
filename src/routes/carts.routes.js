//* IMPORTS
import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import {
  handlePolicies,
  verifyMongoId,
  handleResponse,
} from "../services/utils/utils.js";
import errorsDictionary from "../services/errors/errrosDictionary.js";

//* INIT
const router = Router();
const cartController = new CartController();

//* ENDPOINTS (/api/carts)
router.param("cid", verifyMongoId("cid"));

router.param("pid", verifyMongoId("pid"));

router.get("/", handlePolicies(["ADMIN"]), async (req, res) => {
  try {
    const procces = await cartController.getAll();
    handleResponse(res, procces);
  } catch (err) {
    req.logger.error(
      `${new Date().toDateString()} ${req.method} ${req.url} ${err.message}`
    );
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

// Ver carrito
router.get(
  "/:cid",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res) => {
    const cid = req.params.cid;
    try {
      const cart = await cartController.getById(cid);
      handleResponse(res, cart);
    } catch (err) {
      req.logger.error(
        `${new Date().toDateString()} ${req.method} ${req.url} ${err.message}`
      );
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
);

// Crear carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartController.create();
    handleResponse(res, newCart);
  } catch (err) {
    req.logger.error(
      `${new Date().toDateString()} ${req.method} ${req.url} ${err.message}`
    );
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

// Comprar carrito
router.post(
  "/:cid/purchase",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res) => {
    const cid = req.params.cid;
    const purchaser = req.body.purchaser;
    try {
      const cart = await cartController.purchase(cid, purchaser);
      handleResponse(res, cart);
    } catch (err) {
      req.logger.error(
        `${new Date().toDateString()} ${req.method} ${req.url} ${err.message}`
      );
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
);

// Actualizar cantidad
router.put(
  "/:cid/product/:pid",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const qty = req.body.qty;
    try {
      if (!qty) {
        const cart = await cartController.addProduct(cid, pid);
        handleResponse(res, cart);
      } else {
        const cart = await cartController.updateQty(cid, pid, qty);
        handleResponse(res, cart);
      }
    } catch (err) {
      req.logger.error(
        `${new Date().toDateString()} ${req.method} ${req.url} ${err.message}`
      );
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
);

// Actualizar carrito
router.put("/:cid", handlePolicies(["USER", "PREMIUM"]), async (req, res) => {
  const cid = req.params.cid;
  const products = req.body;
  try {
    const cart = await cartController.update(cid, products);
    handleResponse(res, cart);
  } catch (err) {
    req.logger.error(
      `${new Date().toDateString()} ${req.method} ${req.url} ${err.message}`
    );
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

// Borrar producto del carrito
router.delete(
  "/:cid/product/:pid",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
      const cart = await cartController.deleteProduct(cid, pid);
      handleResponse(res, cart);
    } catch (err) {
      req.logger.error(
        `${new Date().toDateString()} ${req.method} ${req.url} ${err.message}`
      );
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
);

// Vaciar carrito
router.delete(
  "/:cid",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res) => {
    const cid = req.params.cid;
    try {
      const cart = await cartController.empty(cid);
      handleResponse(res, cart);
    } catch (err) {
      req.logger.error(
        `${new Date().toDateString()} ${req.method} ${req.url} ${err.message}`
      );
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
);

export default router;
