// IMPORTS
import express from "express";
import ProductManager from "./productManager.js";

// INIT
const app = express();
const PORT = 8080;
const productManager = new ProductManager();

// ENDPOINTS
app.get("/products", async (req, res) => {
  const products = await productManager.getProducts();
  const limit = req.query.limit;

  if (limit) {
    const productsLimit = products.slice(0, limit);
    res.send({ status: 1, payload: productsLimit });
  } else {
    res.send({ status: 1, payload: products });
  }
});

app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  const product = await productManager.getProductById(id);
  if (!product) {
    res.send({ status: 0, error: "Producto no encontrado" });
  }
  res.send({ status: 1, payload: product });
});

// SERVER
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
