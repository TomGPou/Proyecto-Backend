//* IMPORTS
import { Router } from "express";
import compression from "express-compression";
import { handlePolicies, verifyMongoId } from "../services/utils/utils.js";
import ProductController from "../controllers/products.controller.js";
import CartController from "../controllers/cart.controller.js";
import MessagesController from "../controllers/messages.controller.js";
import { UsersDTO } from "../controllers/users.controller.js";
import { generateFakeProducts } from "../services/utils/mocking.js";
import CustomError from "../services/errors/CustomErrors.class.js";
import errorsDictionary from "../services/errors/errrosDictionary.js";
import passport from "passport";
import jwt from "jsonwebtoken";

//* ROUTER
const router = Router();
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
  async (req, res) => {
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
      req.logger.error(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ${err.message}`
      );
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
);

// Lista de productos con socket
router.get(
  "/realtimeproducts",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res) => {
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
      req.logger.error(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ${err.message}`
      );
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
);

// Mocking
router.get("/mockingproducts", handlePolicies(["ADMIN"]), async (req, res) => {
  const user = req.session.user;

  try {
    const products = await generateFakeProducts(100);
    res
      .status(200)
      .render("mockingproducts", { products: products, user: user });
  } catch (err) {
    req.logger.error(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} ${err.message}`
    );
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

// Carrito
router.get(
  "/cart/:cid",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res) => {
    const cid = req.params.cid;
    const purchaser = req.session.user.email;
    try {
      const cart = await cartController.getById(cid);
      if (cart instanceof CustomError) {
        res.status(cart.status).send({ error: cart.message });
      } else {
        let total = 0;
        cart.products.forEach((product) => {
          total += product._id.price * product.quantity;
        });

        res
          .status(200)
          .render("cart", { cart: cart, total: total, purchaser: purchaser });
      }
    } catch (err) {
      req.logger.error(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()}  ${
          req.method
        } ${req.url} ${err.message}`
      );
      res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
    }
  }
);

// Chat
router.get(
  "/chat",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res) => {
    try {
      const messages = { messages: await messagesController.getChat() };
      res.status(200).render("chat", messages);
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

// Login
router.get("/login", handlePolicies(["PUBLIC"]), async (req, res) => {
  try {
    if (req.session.user) return res.redirect("/");
    res.render("login", {
      showError: req.query.error ? true : false,
      error: req.query.error,
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

// Register
router.get("/register", handlePolicies(["PUBLIC"]), async (req, res) => {
  try {
    if (req.session.user) return res.redirect("/");
    res.render("register", {
      showError: req.query.error ? true : false,
      error: req.query.error,
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

// Profile
router.get(
  "/profile",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res) => {
    try {
      const user = new UsersDTO(req.session.user);
      if (user.role == "admin") user.isAdmin = true;
      res.render("profile", { user: user });
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

// Admin
router.get("/admin", handlePolicies(["ADMIN"]), async (req, res) => {
  try {
    const user = new UsersDTO(req.session.user);
    res.render("profile", { user: user });
  } catch (err) {
    req.logger.error(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} ${err.message}`
    );
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

// Logger Test
router.get("/loggerTest", async (req, res) => {
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
    req.logger.error(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} ${err.message}`
    );
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
  }
});

// Reestablecer contraseña
router.get("/restore", handlePolicies(["PUBLIC"]), async (req, res) => {
  try {
    res.render("restore", {
      showError: req.query.error ? true : false,
      error: req.query.error,
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

// Cambiar contraseña
router.get("/restore/:token", handlePolicies(["PUBLIC"]),
  passport.authenticate("jwt", { session: false }),
   async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const id = decoded.id;
    res.render("restorePassword", { id: id });
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
