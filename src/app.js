// IMPORTS
import express from "express";
import ProductManager from "./productManager.js";

// INIT
const app = express();
const PORT = 8080;
const productManager = new ProductManager();

// ENDPOINTS
app.get("/products", async (req, res) => {
  const limit = +req.query.limit;

  try {
    const products = await productManager.getProducts();

    if (limit) {
      const productsLimit = products.slice(0, limit);
      res.send({ status: 1, payload: productsLimit });
    } else {
      res.send({ status: 1, payload: products });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;

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

// SERVER
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
