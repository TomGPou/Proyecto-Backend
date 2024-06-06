//* IMPORTS
import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
// import cookieParser from 'cookie-parser';
import session from "express-session";
// import FileStore from 'session-file-store';
import MongoStore from "connect-mongo";

// IMPORTS FILES
import config from "./config.js";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import sessionRoutes from "./routes/session.routes.js";

//* INIT AND CONFIG
const app = express();
// const fileStorage = FileStore(session);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
app.use(
  session({
    // store: new fileStorage({ path: './sessions', ttl: 15, retries: 0 }),
    store: MongoStore.create({ mongoUrl: config.MONGODB_URI, ttl: 60 }),
    secret: config.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.set("views", `${config.DIRNAME}/views`);
app.set("view engine", "handlebars");

//* ROUTES
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/chat", messagesRoutes);
app.use("/api/session", sessionRoutes);
app.use("/", viewsRoutes);
app.use("/static", express.static(`${config.DIRNAME}/public`));

//* SERVER
const httpServer = app.listen(config.PORT, async () => {
  await mongoose.connect(config.MONGODB_URI);

  console.log(`Servidor activo en el puerto ${config.PORT} conectado a DB`);
});

// SOCKET
const io = new Server(httpServer);
app.set("io", io);

io.on("connection", (client) => {
  console.log(
    `Cliente conectado, id ${client.id} desde ${client.handshake.address}`
  );
});
