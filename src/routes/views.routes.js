import { Router } from "express";

//* INIT
const router = Router();

//* ENDPOINTS
// Lista de productos
router.get("/products", (req, res) => {
  res.render("index");
});

export default router;
