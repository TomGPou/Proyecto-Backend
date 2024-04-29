import { Router } from "express";
import ProductManager from "../productManager.js";

//* INIT
const router = Router();
const productManager = new ProductManager();

//* ENDPOINTS
// Lista de productos
router.get("/", async (req, res) => {
  try {
    const products = { products: await productManager.getProducts() };
    res.status(200).render("home", products);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = { products: await productManager.getProducts() };
    res.status(200).render("realtimeproducts", products);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
