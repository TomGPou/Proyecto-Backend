//* IMPORTS
import { Router } from "express";
import ProductController from "../controllers/products.controller.js";
import {
  handlePolicies,
  verifyMongoId,
  verifyReqBody,
} from "../services/utils/utils.js";
import { productUploader } from "../services/utils/uploader.js";

//* INIT
const router = Router();
const productController = new ProductController();

//* ENDPOINTS (/api/products)
router.param("pid", verifyMongoId("pid"));

// Obtener todos los productos con paginación y ordenamiento
router.get(
  "/",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res, next) => {
    try {
      const products = await productController.get();
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
  productUploader.single("file"),
  verifyReqBody(["title", "description", "category", "code", "price", "stock"]),
  async (req, res, next) => {
    const io = req.app.get("io");
    const newProduct = req.body;
    newProduct.owner = req.user.role === "admin" ? "admin" : req.user.email;
    if (req.file)
      newProduct.thumbnail = `static/img/products/${req.file.filename}`;

    try {
      const product = await productController.add(newProduct);
      res.status(201).send({ message: "producto agregado", payload: product });

      const products = await productController.get();
      io.emit("products", {
        message: "producto agregado",
        products: products,
      });
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
    const user = req.user.role;
    try {
      const product = await productController.update(pid, updatedData, user);
      const products = await productController.get();
      io.emit("products", {
        message: "producto actualizado",
        products: products,
      });
      res
        .status(200)
        .send({ message: "producto actualizado", payload: product });
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
      res.status(200).send({ message: "producto eliminado", payload: result });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
