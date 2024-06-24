import bcrypt from "bcrypt";
import config from "../config.js";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, hash) =>
  bcrypt.compareSync(password, hash);

export const verifyReqBody = (requiredFields) => {
  return (req, res, next) => {
    const allOk = requiredFields.every(
      (field) =>
        req.body.hasOwnProperty(field) &&
        req.body[field] !== "" &&
        req.body[field] !== null &&
        req.body[field] !== undefined
    );

    if (!allOk)
      return res.status(400).send({
        origin: config.SERVER,
        payload: "Faltan propiedades",
        requiredFields,
      });

    next();
  };
};

export const handlePolicies = (policies) => {
  return (req, res, next) => {
    // verificar ruta publica
    if (policies[0] === "PUBLIC") return next();
    // verificar si existe session
    if (!req.session.user) return res.redirect("/login");

    // verificar politicas de autorizacion
    const userRole = req.session.user.role.toUpperCase();
    if (!policies.includes(userRole))
      return res.status(403).send({ error: "Acceso no autorizado" });

    next();
  };
};
