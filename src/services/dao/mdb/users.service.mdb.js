import CartService from "./cart.service.mdb.js";
import usersModel from "./models/users.model.js";
import { createHash, isValidPassword } from "../../utils/utils.js";
import CustomError from "../../errors/CustomErrors.class.js";
import errorsDictionary from "../../errors/errrosDictionary.js";
import jwt from "jsonwebtoken";
import config from "../../../config.js";
import { deleteUserMail } from "../../utils/nodemailer.js";

// INIT
const cartService = new CartService();

export default class UsersService {
  constructor() {}
  // Validar usuario por id
  async validateUser(uid) {
    const user = await usersModel.findById(uid);
    if (!user) throw new CustomError(errorsDictionary.USER_NOT_FOUND);
    return user;
  }

  // Obtener todos
  async getAll() {
    try {
      const users = await usersModel.find({}, "-password -documents -__v");
      return users;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // Obtener por id
  async getById(id) {
    try {
      const user = await this.validateUser(id);
      return user;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // getOne
  async getOne(query) {
    try {
      const user = await usersModel.findOne(query);
      if (!user) throw new CustomError(errorsDictionary.USER_NOT_FOUND);
      delete user.password;

      return user;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // Crear
  async create(user) {
    try {
      // validar email
      const existingUser = await usersModel.findOne({ email: user.email });
      if (existingUser)
        throw new CustomError(errorsDictionary.EMAIL_ALREADY_EXISTS);
      // crear hash de contraseña
      user.password = createHash(user.password);

      // crear carrito asignarlo al usuario
      const newCart = await cartService.create();
      user.cart = newCart._id;

      // crear usuario
      const newUser = await usersModel.create(user);
      delete newUser.password;

      return newUser;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        if (err.name === "CastError" || err.name === "ValidationError") {
          throw new CustomError(errorsDictionary.INVALID_TYPE);
        } else {
          throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
        }
      }
      throw err;
    }
  }
  // Actualizar
  async update(uid, user) {
    try {
      const updatedUser = await usersModel.findByIdAndUpdate(uid, user, {
        new: true,
      });
      if (!updatedUser) throw new CustomError(errorsDictionary.USER_NOT_FOUND);
      return updatedUser;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        if (err.name === "CastError" || err.name === "ValidationError") {
          throw new CustomError(errorsDictionary.INVALID_TYPE);
        } else {
          throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
        }
      }
      throw err;
    }
  }
  // Eliminar
  async delete(uid) {
    try {
      const user = await this.validateUser(uid);
      // eliminar carrito
      await cartService.delete(user.cart);
      const deletedUser = await usersModel.findByIdAndDelete(uid);
      return deletedUser;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // Login
  async login(email, enteredPassword) {
    try {
      const user = await usersModel.findOne({ email }).lean();
      // validar user y password
      if (!user || !isValidPassword(enteredPassword, user.password))
        throw new CustomError(errorsDictionary.INVALID_PARAMETER);
      // Actualizar last_connection
      user.last_connection = new Date();
      await usersModel.findByIdAndUpdate(user._id, user, { new: true });
      // No mostrar password
      delete user.password;
      return user;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // Buscar por cart
  async getByCart(cid) {
    try {
      const user = await usersModel.findOne({ cart: cid });
      if (!user) throw new CustomError(errorsDictionary.USER_NOT_FOUND);
      return user;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // Actualizar rol
  async changeRole(uid) {
    try {
      const user = await this.validateUser(uid);
      if (user.role === "user") {
        // verificar que el usuario tenga los documentos necesarios
        const requiredDocuments = ["id", "address", "account"];
        const hasRequiredDocuments = requiredDocuments.every((document) =>
          user.documents.some((doc) => doc.name === document)
        );
        if (!hasRequiredDocuments)
          throw new CustomError(errorsDictionary.FEW_FILES);

        user.role = "premium";
      } else if (user.role === "premium") user.role = "user";
      else throw new CustomError(errorsDictionary.INVALID_PARAMETER);
      const updatedUser = await usersModel.findByIdAndUpdate(uid, user, {
        new: true,
      });
      return updatedUser;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // Link con token
  async restoreLink(email) {
    try {
      // validar email
      const user = await usersModel.findOne({ email });
      if (!user) throw new CustomError(errorsDictionary.USER_NOT_FOUND);
      // Generar JWT
      const payload = {
        id: user._id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      };
      const token = jwt.sign(payload, config.JWT_SECRET);
      const link = `http://localhost:${config.PORT}/restore/${token}`;

      return link;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // Cambiar contraseña
  async changePassword(id, newPassword) {
    try {
      const user = await this.validateUser(id);
      // verificar que las contraseñas no sean iguales
      if (isValidPassword(newPassword, user.password))
        throw new CustomError(errorsDictionary.PASSWORD_ALREADY_EXISTS);
      user.password = createHash(newPassword);
      const updatedUser = await usersModel.findByIdAndUpdate(id, user, {
        new: true,
      });
      return updatedUser;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // Agregar documento
  async addDocument(uid, file) {
    try {
      const user = await this.validateUser(uid);
      if (file.fieldname === "profile") {
        const document = {
          name: file.fieldname,
          reference: `static/profiles/${file.originalname}`,
        };
        user.documents.push(document);
      } else {
        const document = {
          name: file.fieldname,
          reference: `static/documents/${file.originalname}`,
        };
        user.documents.push(document);
      }
      const updatedUser = await usersModel.findByIdAndUpdate(uid, user, {
        new: true,
      });
      return updatedUser;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // Eliminar usuarios no usuados
  async deleteUnused() {
    try {
      const deleteDate = new Date();
      deleteDate.setDate(deleteDate.getDate() - 2);
      const users = await usersModel.find({
        role: "user",
        last_connection: { $lt: deleteDate },
      });

      for (const user of users) {
        await deleteUserMail(user.email);
        await this.delete(user._id);
      }
      return users;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }
}
