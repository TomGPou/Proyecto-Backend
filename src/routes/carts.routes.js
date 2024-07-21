//* IMPORTS
import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import { handlePolicies, verifyMongoId } from "../services/utils/utils.js";
import config from "../config.js";

//* INIT
const router = Router();
const cartController = new CartController();

//* ENDPOINTS (/api/carts)
router.param("cid", async (req, res, next, cid) => {
  verifyMongoId(cid);
  next();
});

router.param("pid", async (req, res, next, pid) => {
  verifyMongoId(pid);
  next();
});

// router.param("cid", async (req, res, next, cid) => {
//   if (config.MONGODB_ID_REGEX.test(cid)) {
//     next();
//   } else {
//     res.status(400).send({
//       origin: config.SERVER,
//       payload: null,
//       error: "Id del carrito no válido",
//     });
//   }
// });

// router.param("pid", async (req, res, next, pid) => {
//   if (config.MONGODB_ID_REGEX.test(pid)) {
//     next();
//   } else {
//     res.status(400).send({
//       origin: config.SERVER,
//       payload: null,
//       error: "Id del producto no válido",
//     });
//   }
// });

router.get("/", handlePolicies(["ADMIN"]), async (req, res) => {
  try {
    const procces = await cartController.getAll();
    res.status(200).send({ payload: procces });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// Crear carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartController.create();
    res.status(200).send({ payload: newCart });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
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
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
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
        // res.redirect(`/cart/${cid}`);
      } else {
        const cart = await cartController.updateQty(cid, pid, qty);
        res.status(200);
        res.send({ payload: cart });
        // res.redirect(`/cart/${cid}`);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
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
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
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
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
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
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
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
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
    }
  }
);

export default router;
