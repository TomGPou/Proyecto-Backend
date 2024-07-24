//* IMPORTS
import { Router } from "express";
import ProductController from "../controllers/products.controller.js";
import {
  handlePolicies,
  verifyMongoId,
  verifyReqBody,
} from "../services/utils/utils.js";
import CustomError from "../services/errors/CustomErrors.class.js";
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
      if (products instanceof CustomError) {
        res.status(products.status).send({ error: products.message });
      } else {
        res.status(200).send({ status: "success", payload: products });
      }
    } catch (err) {
      console.error(err);
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
      if (product instanceof CustomError) {
        res.status(product.status).send({ error: product.message });
      } else {
        res.status(200).send({ payload: product });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
);

// Agregar producto
router.post(
  "/",
  handlePolicies(["ADMIN"]),
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
      if (product instanceof CustomError) {
        res.status(product.status).send({ error: product.message });
      } else {
        res.status(200).send({ payload: product });
      }

      const products = await productController.get();
      io.emit("products", { message: "producto agregado", products: products });
    } catch (err) {
      console.error(err);
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
    if (product instanceof CustomError) {
      res.status(product.status).send({ error: product.message });
    } else {
      res.status(200).send({ payload: product });
    }

    const products = await productController.get();
    io.emit("products", {
      message: "producto actualizado",
      products: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

//Eliminar producto
router.delete("/:pid", handlePolicies(["ADMIN"]), async (req, res) => {
  const io = req.app.get("io");
  const pid = req.params.pid;
  try {
    const result = await productController.deleteProduct(pid);
    if (result instanceof CustomError) {
      res.status(result.status).send({ error: result.message });
    } else {
      res.status(200).send({ payload: `Producto de ID: ${pid} eliminado` });
    }

    const products = await productController.get();
    io.emit("products", { message: "producto eliminado", products: products });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

export default router;
