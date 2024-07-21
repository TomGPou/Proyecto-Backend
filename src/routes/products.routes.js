//* IMPORTS
import { Router } from "express";
import config from "../config.js";
import ProductController from "../controllers/products.controller.js";
import { handlePolicies, verifyReqBody } from "../services/utils/utils.js";

//* INIT
const router = Router();
const productController = new ProductController();

//* ENDPOINTS (/api/products)
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

// Obtener todos los productos con parginacion y ordenamiento
router.get(
  "/",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res) => {
    const limit = req.query.limit;
    const page = req.query.page;
    const category = req.query.category;
    const inStock = req.query.inStock;
    const sort = req.query.sort || "asc";

    try {
      const products = await productController.get(
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
  }
);

// producto por id
router.get(
  "/:pid",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res) => {
    const pid = req.params.pid;

    try {
      const product = await productController.getById(pid);
      product
        ? res.send({ status: 1, payload: product })
        : res
            .status(404)
            .send({ error: `Producto de ID ${pid} no encontrado` });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  }
);

// Agregar producto
router.post("/", handlePolicies(["ADMIN"]), verifyReqBody(["title","description","category","code","price","thumbnail","stock"]), async (req, res) => {
  const io = req.app.get("io");
  const newProduct = req.body;
  try {
    const product = await productController.add(newProduct);
    res.status(200).send({ payload: product });

    const products = await productController.get();
    io.emit("products", { message: "producto agregado", products: products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

// Actualizar producto
router.put("/:pid", handlePolicies(["ADMIN"]), async (req, res) => {
  const io = req.app.get("io");
  const pid = req.params.pid;
  const updatedData = req.body;
  try {
    const product = await productController.update(pid, updatedData);
    res.status(200).send({ payload: product });

    const products = await productController.get();
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
router.delete("/:pid", handlePolicies(["ADMIN"]), async (req, res) => {
  const io = req.app.get("io");
  const pid = req.params.pid;
  try {
    await productController.deleteProduct(pid);
    res.status(200).send({ payload: `Producto de ID: ${pid} eliminado` });

    const products = await productController.get();
    io.emit("products", { message: "producto eliminado", products: products });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

export default router;
