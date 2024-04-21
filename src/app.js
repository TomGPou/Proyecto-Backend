// IMPORTS
import express from "express";
import config from "./config.js";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";

// INIT
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/static", express.static(`${config.DIRNAME}/public`));

// SERVER
app.listen(config.PORT, () => {
  console.log(`Servidor activo en el puerto ${config.PORT}`);
});
