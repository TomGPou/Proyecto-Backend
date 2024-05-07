//* IMPORTS
import express from "express";
import handlebars from "express-handlebars";
// IMPORTS FILES
import config from "./config.js";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import messagesRoutes from "./routes/messages.routes.js"
import socket from "./socket.js";

//* INIT AND CONFIG
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.set("views", `${config.DIRNAME}/views`);
app.set("view engine", "handlebars");

//* ROUTES
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/chat", messagesRoutes);
app.use("/", viewsRoutes);
app.use("/static", express.static(`${config.DIRNAME}/public`));

//* SERVER
const httpServer = app.listen(config.PORT, () => {
  console.log(`Servidor activo en el puerto ${config.PORT}`);
});

//SOCKET
const io = socket(httpServer)
app.set("io", io);
