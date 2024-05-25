import { Router } from "express";
// Manager FS
// import CartManager from "../dao/managersFS/cartManager.js";
// Manager MongoDB
import CartManager from "../dao/managersDB/cartManager.mdb.js";
import cartsModel from "../dao/models/carts.model.js";

//* INIT
const router = Router();
const cartManager = new CartManager();

//* ENDPOINTS (/api/carts)

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
router.put("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    const cart = await cartManager.addProduct(cid, pid);
    res.status(200).send({ payload: cart });
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

export default router;
