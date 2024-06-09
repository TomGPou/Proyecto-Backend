import { Router } from "express";

import config from "../config.js";
import { verifyReqBody } from "../utils/utils.js";
import UsersManager from "../dao/managersDB/usersManager.js";
import passport from "passport";
import initAuthStrategies from "../auth/passport.strategies.js";

const router = Router();
const usersManager = new UsersManager();
initAuthStrategies();

//* ENDPOINTS (/api/session)
// register
router.post(
  "/register",
  verifyReqBody(["first_name", "last_name", "email", "password"]),
  passport.authenticate("register", {
    failureRedirect: `/register?error=${encodeURI(
      "Datos de registro no válidos"
    )}`,
  }),
  async (req, res) => {
    try {
      // Redirigir al usuario a /login
      res.status(200);
      res.redirect("/login");
    } catch (err) {
      res
        .status(500)
        .send({ origin: config.SERVER, payload: null, error: err.message });
    }
  }
);

// login local
router.post(
  "/login",
  verifyReqBody(["email", "password"]),
  passport.authenticate("login", {
    failureRedirect: `/login?error=${encodeURI("Datos de acceso no válidos")}`,
  }),
  async (req, res) => {
    try {
      // crear session y guardarla
      req.session.user = req.user;
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
  }
);

// Logout
router.get("/logout", async (req, res) => {
  try {
    // destruir session
    req.session.destroy((err) => {
      if (err)
        return res.status(500).send({
          origin: config.SERVER,
          payload: "Error al ejecutar logout",
          error: err,
        });
      res.status(200);
      // redirigir al login
      res.redirect("/login");
    });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

// Github login
router.get(
  "/ghlogin",
  passport.authenticate("ghlogin", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/ghlogincallback",
  passport.authenticate(
    "ghlogin",
    {
      failureRedirect: `/login?error=${encodeURI(
        "Error al identificar con Github"
      )}`,
    },
    async (req, res) => {
      try {
        // crear session y guardarla
        req.session.user = req.user;
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
    }
  )
);

export default router;
