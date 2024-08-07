//* IMPORTS
import { Router } from "express";
import passport from "passport";
import config from "../config.js";
import { verifyReqBody, handlePolicies } from "../services/utils/utils.js";
import initAuthStrategies from "../services/auth/passport.strategies.js";
import UserController, { UsersDTO } from "../controllers/users.controller.js";
import { restoreMail } from "../services/utils/nodemailer.js";

//* INIT
const router = Router();
const usersController = new UserController();
initAuthStrategies();

//* ENDPOINTS (/api/auth)
// Logout
router.get("/logout", async (req, res, next) => {
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
    next(err);
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
  async (req, res, next) => {
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
      next(err);
    }
  }
);

// Current user
router.get(
  "/current",
  handlePolicies(["USER", "PREMIUM", "ADMIN"]),
  async (req, res, next) => {
    try {
      const user = new UsersDTO(req.session.user);
      res.status(200).send({ payload: user });
    } catch (err) {
      next(err);
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
  async (req, res, next) => {
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
      next(err);
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
  async (req, res, next) => {
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
      next(err);
    }
  }
);

// Link de reestablecimiento de contraseña
router.post("/restore", verifyReqBody(["email"]), async (req, res, next) => {
  try {
    const link = await usersController.restoreLink(req.body.email);
    await restoreMail(link, req.body.email);
    req.logger.info(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} Link enviado`
    );

    res.status(200);
    res.redirect(
      `/login?error=${encodeURI("Se ha enviado un email a su correo")}`
    );
  } catch (err) {
    next(err);
  }
});

// Cambio de contraseña
router.post(
  "/changepassword/:id",
  handlePolicies(["PUBLIC"]),
  async (req, res, next) => {
    const id = req.params.id;
    const newPassword = req.body.password;
    try {
      const updatedUser = await usersController.changePassword(id, newPassword);
      req.logger.info(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} Contraseña cambiada`
      );
      res.status(200);
      res.redirect(`/login?error=${encodeURI("Contraseña actualizada")}`);
    } catch (err) {
      next(err);
    }
  }
);

// Cambio a rol premium
router.put(
  "/premium/:uid",
  handlePolicies(["ADMIN"]),
  async (req, res, next) => {
    const uid = req.params.uid;
    try {
      const user = await usersController.changeRole(uid);

      res.status(200).send({ payload: user });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
