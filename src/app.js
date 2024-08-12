//* IMPORTS
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
// import cookieParser from 'cookie-parser';
import session from "express-session";
// import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";

// IMPORTS FILES
import config from "./config.js";
import errorsHandler from "./services/errors/errors.handler.js";
import addLogger from "./services/utils/logger.js";
// ROUTES
import productsRoutes from "./routes/products.routes.js";
import MongoSingleton from "./services/mongo.singleton.js";
import cartsRoutes from "./routes/carts.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";

//* INIT AND CONFIG
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine());
// const fileStorage = FileStore(session);
app.use(
  session({
    // store: new fileStorage({ path: "./sessions", ttl: 60, retries: 0 }),
    store: MongoStore.create({ mongoUrl: config.MONGODB_URI, ttl: 60 }),
    secret: config.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("views", `${config.DIRNAME}/views`);
app.set("view engine", "handlebars");

//* LOGGER
app.use(addLogger);

//* ROUTES
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/chat", messagesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/", viewsRoutes);
app.use("/static", express.static(`${config.DIRNAME}/public`));

//* ERROR HANDLER
app.use(errorsHandler);

//* SERVER
const httpServer = app.listen(config.PORT, async () => {
  MongoSingleton.getInstance();
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
