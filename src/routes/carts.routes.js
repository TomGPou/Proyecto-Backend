//* IMPORTS
import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import { handlePolicies, verifyMongoId } from "../services/utils/utils.js";
import CustomError from "../services/errors/CustomErrors.class.js";
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
    res.status(200).send({ payload: procces });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.status).send({ error: err.message });
    } else {
      console.error(err);
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
});

// Crear carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartController.create();
    res.status(200).send({ payload: newCart });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.status).send({ error: err.message });
    } else {
      console.error(err);
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
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
      res.status(200).send({ payload: cart });
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
        res.status(200);
        res.send({ payload: cart });
      } else {
        const cart = await cartController.updateQty(cid, pid, qty);
        res.status(200);
        res.send({ payload: cart });
      }
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

// Borrar producto del carrito
router.delete(
  "/:cid/product/:pid",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
      const cart = await cartController.deleteProduct(cid, pid);
      res.status(200).send({ payload: cart });
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

// Actualizar carrito
router.put("/:cid", handlePolicies(["USER", "PREMIUM"]), async (req, res) => {
  const cid = req.params.cid;
  const products = req.body;
  try {
    const cart = await cartController.update(cid, products);
    res.status(200).send({ payload: cart });
  } catch (err) {
    if (err instanceof CustomError) {
      res.status(err.status).send({ error: err.message });
    } else {
      console.error(err);
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
});

// Vaciar carrito
router.delete(
  "/:cid",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res) => {
    const cid = req.params.cid;
    try {
      const cart = await cartController.empty(cid);
      res.status(200).send({ payload: cart });
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

// Comprar carrito
router.post(
  "/:cid/purchase",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res) => {
    const cid = req.params.cid;
    const purchaser = req.body.purchaser;
    try {
      const cart = await cartController.purchase(cid, purchaser);
      res.status(200).send({ payload: cart });
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

export default router;
