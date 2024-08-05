//* IMPORTS
import { Router } from "express";
import ProductController from "../controllers/products.controller.js";
import {
  handlePolicies,
  handleError,
  verifyMongoId,
  verifyReqBody,
} from "../services/utils/utils.js";
import errorsDictionary from "../services/errors/errrosDictionary.js";
import CustomError from "../services/errors/CustomErrors.class.js";

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
      if (products instanceof CustomError)
        return handleError(req, res, products);
      res.status(200).send({ payload: products });
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
      if (product instanceof CustomError) return handleError(req, res, product);
      res.status(200).send({ payload: product });
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
  handlePolicies(["ADMIN", "PREMIUM"]),
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
    newProduct.owner = req.user.role === "admin" ? "admin" : req.user.email;
    try {
      const product = await productController.add(newProduct);
      if (product instanceof CustomError) return handleError(req, res, product);

      const products = await productController.get();
      io.emit("products", { message: "producto agregado", products: products });
      res.status(200).send({ payload: product });
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
router.put("/:pid", handlePolicies(["ADMIN", "PREMIUM"]), async (req, res) => {
  const io = req.app.get("io");
  const pid = req.params.pid;
  const updatedData = req.body;
  const user = req.user.role === "admin" ? "admin" : req.user.email;
  try {
    const product = await productController.update(pid, updatedData, user);
    if (product instanceof CustomError) return handleError(req, res, product);

    const products = await productController.get();
    io.emit("products", {
      message: "producto actualizado",
      products: products,
    });
    res.status(200).send({ payload: product });
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
router.delete(
  "/:pid",
  handlePolicies(["ADMIN", "PREMIUM"]),
  async (req, res) => {
    const io = req.app.get("io");
    const pid = req.params.pid;
    const user = req.user.role === "admin" ? "admin" : req.user.email;
    try {
      const result = await productController.deleteProduct(pid, user);
      if (result instanceof CustomError) return handleError(req, res, result);

      const products = await productController.get();
      io.emit("products", {
        message: "producto eliminado",
        products: products,
      });
      res.status(200).send({ payload: result });
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

export default router;
