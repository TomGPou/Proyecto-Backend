import { Router } from "express";
import ProductManager from "../productManager.js";

//* INIT
const router = Router();
const productManager = new ProductManager();

//* ENDPOINTS
// Lista de productos
router.get("/products", async (req, res) => {
  const products = { products: await productManager.getProducts() };
  res.render("index", products);
});

export default router;
