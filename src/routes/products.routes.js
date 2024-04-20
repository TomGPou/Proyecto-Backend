import { Router } from "express";
import ProductManager from "../productManager.js";

// INIT
const router = Router();
const productManager = new ProductManager();

// ENDPOINTS
// obtener todos los productos con limite
router.get("/", async (req, res) => {
  const limit = +req.query.limit;

  try {
    const products = await productManager.getProducts();
    if (limit) {
      const productsLimit = products.slice(0, limit);
      res.status(200).send({ payload: productsLimit });
    } else {
      res.status(200).send({ payload: products });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// producto por id
router.get("/:pid", async (req, res) => {
  const pid = +req.params.pid;

  try {
    const product = await productManager.getProductById(pid);
    product
      ? res.send({ status: 1, payload: product })
      : res.status(404).send({ error: `Producto de ID ${pid} no encontrado` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Agregar producto
router.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    const product = await productManager.addProduct(newProduct);
    res.status(200).send({ payload: product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Actualizar producto
router.put("/:pid", async (req, res) => {
  const pid = +req.params.pid;
  const updatedData = req.body;
  try {
    const product = await productManager.updateProduct(pid, updatedData);
    res.status(200).send({ payload: product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

//Eliminar producto
router.delete("/:pid", async (req, res) => {
  const pid = +req.params.pid;
  try {
    const product = await productManager.deleteProduct(pid);
    res.status(200).send({ payload: `Producto de ID: ${pid} eliminado` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
