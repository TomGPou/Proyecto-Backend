//* IMPORTS
import { Router } from "express";
import passport from "passport";
import config from "../config.js";
import { verifyReqBody, handlePolicies } from "../services/utils/utils.js";
import initAuthStrategies from "../services/auth/passport.strategies.js";
import { UsersDTO } from "../controllers/users.controller.js";
import errorsDictionary from "../services/errors/errrosDictionary.js";

//* INIT
const router = Router();
initAuthStrategies();

//* ENDPOINTS (/api/auth)
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
    req.logger.error(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} ${err.message}`
    );
    res.status(500).send({ error: errorsDictionary.UNHANDLED_ERROR.message });
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
  passport.authenticate("ghlogin", {
    failureRedirect: `/login?error=${encodeURI(
      "Error al identificar con Github"
    )}`,
  }),
  async (req, res) => {
    try {
      req.user.password = null;
      req.session.user = req.user;
      req.session.save((err) => {
        if (err)
          return res
            .status(500)
            .send({ origin: config.SERVER, payload: null, error: err.message });
        req.logger.info(
          `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
            req.method
          } ${req.url} Usuario autenticado`
        );
        res.redirect("/");
      });
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

// Current user
router.get(
  "/current",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res) => {
    try {
      const user = new UsersDTO(req.session.user);
      res.status(200).send({ payload: user });
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
      req.logger.info(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} Usuario registrado`
      );
      res.status(200);
      res.redirect("/login");
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
        req.logger.info(
          `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
            req.method
          } ${req.url} Usuario autenticado`
        );
        res.status(200);
        res.redirect("/");
      });
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

export default router;
