import bcrypt from "bcrypt";
import config from "../../config.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Hasheo de contraseña
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Verificacion de contraseña
export const isValidPassword = (password, hash) =>
  bcrypt.compareSync(password, hash);

// Verificacion de session
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

// Verificacion de politicas
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

// Lectura de archivo JSON
export const readFile = async (path) => {
  try {
    const data = await fs.promises.readFile(path);
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Escritura de archivo JSON
export const writeFile = async (path, data) => {
  try {
    await fs.promises.writeFile(path, JSON.stringify(data), "utf-8");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Generar código unico
export const generateUniqueCode = () => {
  return uuidv4();
};
