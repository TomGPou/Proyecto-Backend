//* IMPORTS
import { Router } from "express";
import { addProductToCart, createCart, deleteProductFromCart, emptyCart, getAllCarts, getCartById, updateCart, updateProductQty } from "../controllers/cart.controller.js";

//* INIT
const router = Router();

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
    const procces = await getAllCarts();
    res.status(200).send({ payload: procces });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// Crear carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await createCart();
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
    const cart = await getCartById(cid);
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
      const cart = await addProductToCart(cid, pid);
      res.status(200).send({ payload: cart });
    } else {
      const cart = await updateProductQty(cid, pid, qty);
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
    const cart = await deleteProductFromCart(cid, pid);
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
    const cart = await updateCart(cid, products);
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
    const cart = await emptyCart(cid);
    res.status(200).send({ payload: cart });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

export default router;
