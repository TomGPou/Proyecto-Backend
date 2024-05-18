import { Router } from "express";
import CartManager from "../dao/managersFS/cartManager.js";

//* INIT
const router = Router();
const cartManager = new CartManager();

//* ENDPOINTS (/api/carts)
// Crear carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(200).send({ payload: newCart });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// Ver carrito
router.get("/:cid", async (req, res) => {
  const cid = +req.params.cid;
  try {
    const cart = await cartManager.getCartById(cid);
    res.status(200).send({ payload: cart.products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const cid = +req.params.cid;
  const pid = +req.params.pid;
  try {
    const cart = await cartManager.addProductToCart(cid, pid);
    res.status(200).send({ payload: cart });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

export default router;
