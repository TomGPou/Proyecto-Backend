import { Router } from "express";

import config from "../config.js";
import UsersManager from "../dao/managersDB/usersManager.js";

const router = Router();
const usersManager = new UsersManager();

//* ENDPOINTS (/api/session)
// register
router.post("/register", async (req, res) => {
  try {
    const newUser = req.body;
    const user = await usersManager.create(newUser);

    if (!user) {
      return res.status(401).send({
        origin: config.SERVER,
        payload: "Datos de registro no válidos",
      });
    }
    // Redirigir al usuario a /login
    res.status(200);
    res.redirect("/login");
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersManager.login(email, password);

    if (!user) {
      return res
        .status(401)
        .send({ origin: config.SERVER, payload: "Datos de acceso no válidos" });
    }
    // crear session y guardarla
    req.session.user = user;
    req.session.save((err) => {
      if (err)
        return res.status(500).send({
          origin: config.SERVER,
          payload: "Error al iniciar sesión",
          error: err,
        });
      // redirigir al home
      res.status(200);
      res.redirect("/");
    });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

// Logout
router.get("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err)
        return res.status(500).send({
          origin: config.SERVER,
          payload: "Error al ejecutar logout",
          error: err,
        });
      res.status(200);
      // .send({ origin: config.SERVER, payload: "Usuario desconectado" });
      res.redirect("/login");
    });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

export default router;
