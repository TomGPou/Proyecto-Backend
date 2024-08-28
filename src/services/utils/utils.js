import bcrypt from "bcrypt";
import config from "../../config.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import errorsDictionary from "../errors/errrosDictionary.js";
import CustomError from "../errors/CustomErrors.class.js";

// Hasheo de contraseña
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Verificacion de contraseña
export const isValidPassword = (password, hash) =>
  bcrypt.compareSync(password, hash);

// Verificacion de req body
export const verifyReqBody = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];
    requiredFields.forEach((field) => {
      // Verificar si el campo existe en req.body y no está vacío
      if (!(field in req.body) || !req.body[field]) {
        missingFields.push(field);
      }
    });
    if (missingFields.length > 0) {
      const errData = {
        missingFields: missingFields,
        providedData: req.body,
      };
      req.logger.warning("Faltan ingresar una o más propiedades", errData);
      throw new CustomError(errorsDictionary.FEW_PARAMETERS);
    }
    next();
  };
};

// Verificacion de politicas
export const handlePolicies = (policies) => {
  return (req, res, next) => {
    // verificar ruta publica
    if (policies[0] === "PUBLIC") return next();
    // verificar si existe session
    if (!req.session.user) {
      req.logger.info(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} No existe sesion de usuario`
      );
      return res.redirect("/login");
    }

    // verificar politicas de autorizacion
    const userRole = req.session.user.role.toUpperCase();
    if (!policies.includes(userRole)) {
      req.logger.warning(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} Usuario no autorizado`
      );
      throw new CustomError(errorsDictionary.USER_NOT_AUTHORIZED);
    }
    next();
  };
};

// Verificacion de id de MongoDB
export const verifyMongoId = (id) => {
  return (req, res, next) => {
    if (!config.MONGODB_ID_REGEX.test(req.params[id])) {
      req.logger.info(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ID de Mongo no valido`
      );
      throw new CustomError(errorsDictionary.INVALID_MONGOID_FORMAT);
    } else {
      next();
    }
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
export const generateCode = () => {
  return uuidv4();
};

//Manager de errores en rutas
export const handleError = (req, res, result) => {
  req.logger.warning(
    `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
      req.method
    } ${req.url} Error: ${result.message}`
  );
  res.status(result.status).send({ error: result.message });
};
