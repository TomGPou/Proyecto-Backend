//* IMPORTS
import { Router } from "express";
import compression from "express-compression";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  handleError,
  handlePolicies,
  verifyMongoId,
} from "../services/utils/utils.js";
import ProductController from "../controllers/products.controller.js";
import CartController from "../controllers/cart.controller.js";
import MessagesController from "../controllers/messages.controller.js";
import { UsersDTO } from "../controllers/users.controller.js";
import { generateFakeProducts } from "../services/utils/mocking.js";
import CustomError from "../services/errors/CustomErrors.class.js";
import errorsDictionary from "../services/errors/errrosDictionary.js";
import initAuthStrategies from "../services/auth/passport.strategies.js";
import config from "../config.js";

//* INIT

const router = Router();
initAuthStrategies();
router.use(compression({ brotli: { enabled: true }, zlib: {} }));

//* CONTROLLERS
const productController = new ProductController();
const cartController = new CartController();
const messagesController = new MessagesController();

//* ENDPOINTS (/)
router.param("cid", verifyMongoId("cid"));

// Lista de productos
router.get(
  "/",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res, next) => {
    const limit = req.query.limit;
    const page = req.query.page;
    const category = req.query.category;
    const inStock = req.query.inStock;
    const sort = req.query.sort || "asc";

    const user = req.session.user;

    try {
      const products = await productController.get(
        limit,
        page,
        category,
        inStock,
        sort
      );
      res.status(200).render("home", { products: products, user: user });
    } catch (err) {
      next(err);
    }
  }
);

// Lista de productos con socket
router.get(
  "/realtimeproducts",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res, next) => {
    const limit = req.query.limit;
    const page = req.query.page;
    const category = req.query.category;
    const inStock = req.query.inStock;
    const sort = req.query.sort || "asc";

    const user = req.session.user;

    try {
      const products = await productController.get(
        limit,
        page,
        category,
        inStock,
        sort
      );
      res
        .status(200)
        .render("realtimeproducts", { products: products, user: user });
    } catch (err) {
      next(err);
    }
  }
);

// Mocking
router.get(
  "/mockingproducts",
  handlePolicies(["ADMIN"]),
  async (req, res, next) => {
    const user = req.session.user;

    try {
      const products = await generateFakeProducts(100);
      res
        .status(200)
        .render("mockingproducts", { products: products, user: user });
    } catch (err) {
      next(err);
    }
  }
);

// Carrito
router.get(
  "/cart/:cid",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res, next) => {
    const cid = req.params.cid;
    const purchaser = req.session.user.email;
    try {
      const cart = await cartController.getById(cid);

      let total = 0;
      cart.products.forEach((product) => {
        total += product._id.price * product.quantity;
      });

      res
        .status(200)
        .render("cart", { cart: cart, total: total, purchaser: purchaser });
    } catch (err) {
      next(err);
    }
  }
);

// Chat
router.get(
  "/chat",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res, next) => {
    try {
      const messages = { messages: await messagesController.getChat() };
      res.status(200).render("chat", messages);
    } catch (err) {
      next(err);
    }
  }
);

// Login
router.get("/login", handlePolicies(["PUBLIC"]), async (req, res, next) => {
  try {
    if (req.session.user) return res.redirect("/");
    res.render("login", {
      showError: req.query.error ? true : false,
      error: req.query.error,
    });
  } catch (err) {
    next(err);
  }
});

// Register
router.get("/register", handlePolicies(["PUBLIC"]), async (req, res, next) => {
  try {
    if (req.session.user) return res.redirect("/");
    res.render("register", {
      showError: req.query.error ? true : false,
      error: req.query.error,
    });
  } catch (err) {
    next(err);
  }
});

// Profile
router.get(
  "/profile",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res, next) => {
    try {
      const user = new UsersDTO(req.session.user);
      if (user.role == "admin") user.isAdmin = true;
      res.render("profile", { user: user });
    } catch (err) {
      next(err);
    }
  }
);

// Admin
router.get("/admin", handlePolicies(["ADMIN"]), async (req, res, next) => {
  try {
    const user = new UsersDTO(req.session.user);
    res.render("profile", { user: user });
  } catch (err) {
    next(err);
  }
});

// Logger Test
router.get("/loggerTest", async (req, res, next) => {
  try {
    req.logger.fatal(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} Logger Test Fatal`
    );
    req.logger.error(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} Logger Test Fatal`
    );
    req.logger.warning(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} Logger Test Fatal`
    );
    req.logger.info(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} Logger Test Fatal`
    );
    req.logger.http(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} Logger Test Fatal`
    );
    req.logger.debug(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} Logger Test Fatal`
    );

    res.status(200).send({ payload: "Logs enviados" });
  } catch (err) {
    next(err);
  }
});

// Reestablecer contraseña
router.get("/restore", handlePolicies(["PUBLIC"]), async (req, res, next) => {
  try {
    res.render("restore", {
      showError: req.query.error ? true : false,
      error: req.query.error,
    });
  } catch (err) {
    next(err);
  }
});

// Cambiar contraseña
router.get(
  "/restore/:token",
  handlePolicies(["PUBLIC"]),
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const token = req.params.token;
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const id = decoded.id;
      res.render("changePassword", { id: id });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
