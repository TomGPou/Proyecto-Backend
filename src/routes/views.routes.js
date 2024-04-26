import { Router } from "express";
import ProductManager from "../productManager.js";

//* INIT
const router = Router();
const productManager = new ProductManager();

//* ENDPOINTS
// Lista de productos
router.get("/", async (req, res) => {
  const products = { products: await productManager.getProducts() };
  res.render("home", products);
});

router.get("/realtimeproducts", async (req, res) => {
  const products = { products: await productManager.getProducts() };
  res.render("realtimeproducts", products);
});

export default router;
