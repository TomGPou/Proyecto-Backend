//* IMPORTS
import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import { handlePolicies, verifyMongoId } from "../services/utils/utils.js";

//* INIT
const router = Router();
const cartController = new CartController();

//* ENDPOINTS (/api/carts)
router.param("cid", verifyMongoId("cid"));

router.param("pid", verifyMongoId("pid"));

router.get("/", handlePolicies(["ADMIN"]), async (req, res, next) => {
  try {
    const procces = await cartController.getAll();

    res.status(200).send({ payload: procces });
  } catch (err) {
    next(err);
  }
});

// Ver carrito
router.get(
  "/:cid",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res, next) => {
    const cid = req.params.cid;
    try {
      const cart = await cartController.getById(cid);

      res.status(200).send({ payload: cart });
    } catch (err) {
      next(err);
    }
  }
);

// Crear carrito
router.post("/", async (req, res, next) => {
  try {
    const newCart = await cartController.create();

    res.status(200).send({ payload: newCart });
  } catch (err) {
    next(err);
  }
});

// Comprar carrito
router.post(
  "/:cid/purchase",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res, next) => {
    const cid = req.params.cid;
    const purchaser = req.body.purchaser;
    try {
      const cart = await cartController.purchase(cid, purchaser);

      res.status(200).send({ payload: cart });
    } catch (err) {
      next(err);
    }
  }
);

// Agregar al carrito
router.put(
  "/:cid/product/:pid",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const qty = req.body.qty;
    const user = req.user.role === "user" ? "user" : req.user.email;
    try {
      if (!qty) {
        const cart = await cartController.addProduct(cid, pid, user);

        res.status(200).send({ payload: cart });
      } else {
        const cart = await cartController.updateQty(cid, pid, qty, user);

        res.status(200).send({ payload: cart });
      }
    } catch (err) {
      next(err);
    }
  }
);

// Actualizar carrito
router.put(
  "/:cid",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res, next) => {
    const cid = req.params.cid;
    const products = req.body;
    try {
      const cart = await cartController.update(cid, products);

      res.status(200).send({ payload: cart });
    } catch (err) {
      next(err);
    }
  }
);

// Borrar producto del carrito
router.delete(
  "/:cid/product/:pid",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
      const cart = await cartController.deleteProduct(cid, pid);

      res.status(200).send({ payload: cart });
    } catch (err) {
      next(err);
    }
  }
);

// Vaciar carrito
router.delete(
  "/:cid",
  handlePolicies(["USER", "PREMIUM"]),
  async (req, res, next) => {
    const cid = req.params.cid;
    try {
      const cart = await cartController.empty(cid);

      res.status(200).send({ payload: cart });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
