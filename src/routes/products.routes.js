import { Router } from "express";
// Manager FS
// import ProductManager from "../dao/managersFS/productManager.js";
// Manager MongoDB
import ProductManager from "../dao/managersDB/productManager.mdb.js";
import config from "../config.js";

//* INIT
const router = Router();
const productManager = new ProductManager();

//* ENDPOINTS (/api/products)
// Obtener todos los productos con limite
router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const category = req.query.category;
  const inStock = req.query.inStock;
  const sort = req.query.sort || "asc";

  try {
    const products = await productManager.getProducts(
      limit,
      page,
      category,
      inStock,
      sort
    );
    res.status(200).send({ status: "success", payload: products });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

// producto por id
router.get("/:pid", async (req, res) => {
  const pid = req.params.pid;

  try {
    const product = await productManager.getProductById(pid);
    product
      ? res.send({ status: 1, payload: product })
      : res.status(404).send({ error: `Producto de ID ${pid} no encontrado` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

// Agregar producto
router.post("/", async (req, res) => {
  const io = req.app.get("io");
  const newProduct = req.body;
  try {
    const product = await productManager.addProduct(newProduct);
    res.status(200).send({ payload: product });

    const products = await productManager.getProducts();
    io.emit("products", { message: "producto agregado", products: products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// Actualizar producto
router.put("/:pid", async (req, res) => {
  const io = req.app.get("io");
  const pid = req.params.pid;
  const updatedData = req.body;
  try {
    const product = await productManager.updateProduct(pid, updatedData);
    res.status(200).send({ payload: product });

    const products = await productManager.getProducts();
    io.emit("products", {
      message: "producto actualizado",
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

//Eliminar producto
router.delete("/:pid", async (req, res) => {
  const io = req.app.get("io");
  const pid = req.params.pid;
  try {
    await productManager.deleteProduct(pid);
    res.status(200).send({ payload: `Producto de ID: ${pid} eliminado` });

    const products = await productManager.getProducts();
    io.emit("products", { message: "producto eliminado", products: products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

export default router;
