//* IMPORTS
import { Router } from "express";
import ProductController from "../controllers/products.controller.js";
import {
  handlePolicies,
  verifyMongoId,
  verifyReqBody,
} from "../services/utils/utils.js";

//* INIT
const router = Router();
const productController = new ProductController();

//* ENDPOINTS (/api/products)
router.param("pid", verifyMongoId("pid"));

// Obtener todos los productos con parginacion y ordenamiento
router.get(
  "/",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res, next) => {
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

      res.status(200).send({ payload: products });
    } catch (err) {
      next(err);
    }
  }
);

// producto por id
router.get(
  "/:pid",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res, next) => {
    const pid = req.params.pid;

    try {
      const product = await productController.getById(pid);
      res.status(200).send({ payload: product });
    } catch (err) {
      next(err);
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
  async (req, res, next) => {
    const io = req.app.get("io");
    const newProduct = req.body;
    newProduct.owner = req.user.role === "admin" ? "admin" : req.user.email;
    try {
      const product = await productController.add(newProduct);
      const products = await productController.get();
      io.emit("products", {
        message: "producto agregado",
        products: products,
      });
      res.status(200).send({ payload: product });
    } catch (err) {
      next(err);
    }
  }
);

// Actualizar producto
router.put(
  "/:pid",
  handlePolicies(["ADMIN", "PREMIUM"]),
  async (req, res, next) => {
    const io = req.app.get("io");
    const pid = req.params.pid;
    const updatedData = req.body;
    const user = req.user.role === "admin" ? "admin" : req.user.email;
    try {
      const product = await productController.update(pid, updatedData, user);
      const products = await productController.get();
      io.emit("products", {
        message: "producto actualizado",
        products: products,
      });
      res.status(200).send({ payload: product });
    } catch (err) {
      next(err);
    }
  }
);

//Eliminar producto
router.delete(
  "/:pid",
  handlePolicies(["ADMIN", "PREMIUM"]),
  async (req, res, next) => {
    const io = req.app.get("io");
    const pid = req.params.pid;
    const user = req.user.role === "admin" ? "admin" : req.user.email;
    try {
      const result = await productController.deleteProduct(pid, user);

      const products = await productController.get();
      io.emit("products", {
        message: "producto eliminado",
        products: products,
      });
      res.status(200).send({ payload: result });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
