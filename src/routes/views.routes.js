import { Router } from "express";
// Managers FS
// import ProductManager from "../dao/managersFS/productManager.js";
// import ChatManager from "../dao/managersFS/messagesManager.js";
// Managers MongoDB
import ProductManager from "../dao/managersDB/productManager.mdb.js";
import ChatManager from "../dao/managersDB/messagesManager.mdb.js";
import CartManager from "../dao/managersDB/cartManager.mdb.js";
import config from "../config.js";
import { handlePolicies } from "../utils/utils.js";

//* INIT
const router = Router();
const productManager = new ProductManager();
const chatManager = new ChatManager();
const cartManager = new CartManager();

// MIDLEWARES
const loginValidation = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  next();
};

//* ENDPOINTS (/)
router.param("cid", async (req, res, next, cid) => {
  if (config.MONGODB_ID_REGEX.test(cid)) {
    next();
  } else {
    res.status(400).send({
      origin: config.SERVER,
      payload: null,
      error: "Id del carrito no válido",
    });
  }
});

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
      const products = await productManager.getProducts(
        limit,
        page,
        category,
        inStock,
        sort
      );
      res.status(200).render("home", { products: products, user: user });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
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
    const sort = req.query.sort || "asc";
    try {
      const products = {
        products: await productManager.getProducts(limit, page, category, sort),
      };
      res.status(200).render("realtimeproducts", { products: products });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

// Carrito
router.get(
  "/carts/:cid",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res) => {
    const cid = req.params.cid;
    try {
      const cart = await cartManager.getById(cid);

      res.status(200).render("cart", { cart: cart });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

// Chat
router.get(
  "/chat",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res) => {
    try {
      const messages = { messages: await chatManager.getMessages() };
      res.status(200).render("chat", messages);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

// Login
router.get("/login", handlePolicies(["PUBLIC"]), (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("login", {
    showError: req.query.error ? true : false,
    error: req.query.error,
  });
});

// Register
router.get("/register", handlePolicies(["PUBLIC"]), (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("register", {
    showError: req.query.error ? true : false,
    error: req.query.error,
  });
});

// Profile
router.get(
  "/profile",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  (req, res) => {
    const user = req.session.user;
    if (user.role == "admin") user.isAdmin = true;
    res.render("profile", { user: user });
  }
);

// Admin
router.get("/admin", handlePolicies(["ADMIN"]), (req, res) => {
  const user = req.session.user;

  res.render("profile", { user: user });
});

export default router;
