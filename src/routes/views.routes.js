import { Router } from "express";
// Managers FS
// import ProductManager from "../dao/managersFS/productManager.js";
// import ChatManager from "../dao/managersFS/messagesManager.js";
// Managers MongoDB
import ProductManager from "../dao/managersDB/productManagerDB.js";
import ChatManager from "../dao/managersDB/messagesManagerDB.js";

//* INIT
const router = Router();
const productManager = new ProductManager();
const chatManager = new ChatManager();

//* ENDPOINTS (/)
// Lista de productos
router.get("/", async (req, res) => {
  try {
    const products = { products: await productManager.getProducts() };
    res.status(200).render("home", products);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Lista de productos con socket
router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = { products: await productManager.getProducts() };
    res.status(200).render("realtimeproducts", products);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Chat
router.get("/chat", async (req, res) => {
  try {
    const messages = { messages: await chatManager.getMessages() };
    res.status(200).render("chat", messages);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
