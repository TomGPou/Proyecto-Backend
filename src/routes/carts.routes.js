import { Router } from "express";
// Manager FS
// import CartManager from "../dao/managersFS/cartManager.js";
// Manager MongoDB
import CartManager from "../controllers/controllersDB/cartManager.mdb.js";
import cartsModel from "../models/carts.model.js";

//* INIT
const router = Router();
const cartManager = new CartManager();

//* ENDPOINTS (/api/carts)
router.param("cid", async (req, res, next, cid) => {
  if (config.MONGODB_ID_REGEX.test(cid)) {
    next();
  } else {
    res.status(400).send({
      origin: config.SERVER,
      payload: null,
      error: "Id del carrito no válido",
    });
  }
});

router.param("pid", async (req, res, next, pid) => {
  if (config.MONGODB_ID_REGEX.test(pid)) {
    next();
  } else {
    res.status(400).send({
      origin: config.SERVER,
      payload: null,
      error: "Id del producto no válido",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const procces = await cartsModel.find().lean();
    res.status(200).send({ payload: procces });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// Crear carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.create();
    res.status(200).send({ payload: newCart });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// Ver carrito
router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartManager.getById(cid);
    res.status(200).send({ payload: cart });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// Agregar producto al carrito
// router.put("/:cid/product/:pid", async (req, res) => {
//   const cid = req.params.cid;
//   const pid = req.params.pid;
//   try {
//     const cart = await cartManager.addProduct(cid, pid);
//     res.status(200).send({ payload: cart });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({ error: error.message });
//   }
// });

// Actualizar cantidad
router.put("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const qty = req.body.qty;
  try {
    if (!qty) {
      const cart = await cartManager.addProduct(cid, pid);
      res.status(200).send({ payload: cart });
    } else {
      const cart = await cartManager.updateQty(cid, pid, qty);
      res.status(200).send({ payload: cart });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// Borrar producto del carrito
router.delete("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    const cart = await cartManager.deleteProduct(cid, pid);
    res.status(200).send({ payload: cart });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// Actualizar carrito
router.put("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const products = req.body;
  try {
    const cart = await cartManager.update(cid, products);
    res.status(200).send({ payload: cart });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// Vaciar carrito
router.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartManager.empty(cid);
    res.status(200).send({ payload: cart });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

export default router;
