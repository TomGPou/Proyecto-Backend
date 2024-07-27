//* IMPORTS
import { Router } from "express";
import ProductController from "../controllers/products.controller.js";
import {
  handlePolicies,
  handleResponse,
  verifyMongoId,
  verifyReqBody,
} from "../services/utils/utils.js";
import errorsDictionary from "../services/errors/errrosDictionary.js";

//* INIT
const router = Router();
const productController = new ProductController();

//* ENDPOINTS (/api/products)
router.param("pid", verifyMongoId("pid"));

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
      handleResponse(req, res, products);
    } catch (err) {
      req.logger.error(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ${err.message}`
      );
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
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
      handleResponse(req, res, product);
    } catch (err) {
      req.logger.error(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ${err.message}`
      );
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
);

// Agregar producto
router.post(
  "/",
  // handlePolicies(["ADMIN"]),
  verifyReqBody([
    "title",
    "description",
    "category",
    "code",
    "price",
    "thumbnail",
    "stock",
  ]),
  async (req, res) => {
    const io = req.app.get("io");
    const newProduct = req.body;
    try {
      const product = await productController.add(newProduct);
      handleResponse(req, res, product);

      const products = await productController.get();
      io.emit("products", { message: "producto agregado", products: products });
    } catch (err) {
      req.logger.error(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ${err.message}`
      );
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
);

// Actualizar producto
router.put("/:pid", handlePolicies(["ADMIN"]), async (req, res) => {
  const io = req.app.get("io");
  const pid = req.params.pid;
  const updatedData = req.body;
  try {
    const product = await productController.update(pid, updatedData);
    handleResponse(req, res, product);

    const products = await productController.get();
    io.emit("products", {
      message: "producto actualizado",
      products: products,
    });
  } catch (err) {
    req.logger.error(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} ${err.message}`
    );
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

//Eliminar producto
router.delete("/:pid", handlePolicies(["ADMIN"]), async (req, res) => {
  const io = req.app.get("io");
  const pid = req.params.pid;
  try {
    const result = await productController.deleteProduct(pid);
    handleResponse(req, res, result);

    const products = await productController.get();
    io.emit("products", { message: "producto eliminado", products: products });
  } catch (err) {
    req.logger.error(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} ${err.message}`
    );
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

export default router;
