import {
  readFile,
  writeFile,
  createHash,
  isValidPassword,
} from "../../utils/utils.js";
import CartService from "./cart.service.fs.js";
import jwt from "jsonwebtoken";
import config from "../../../config.js";
import CustomError from "../../errors/CustomErrors.class.js";
import errorsDictionary from "../../errors/errrosDictionary.js";

//INIT
const cartService = new CartService();

export default class UsersService {
  constructor() {
    this.path = "./src/services/utils/users.json";
  }

  // Obtener todos
  async getAll() {
    try {
      const users = await readFile(this.path);
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
      const users = await readFile(this.path);
      const user = users.find((user) => user.uid === id);
      if (!user) throw new CustomError(errorsDictionary.ID_NOT_FOUND);
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
      const users = await readFile(this.path);
      const user = users.find((user) =>
        Object.keys(query).every((key) => user[key] === query[key])
      );
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
  async create(newUser) {
    try {
      const users = await readFile(this.path);
      // validar email
      const emailExists = users.find((user) => user.email === newUser.email);
      if (emailExists)
        throw new CustomError(errorsDictionary.EMAIL_ALREADY_EXISTS);

      // hash de password
      newUser.password = createHash(newUser.password);
      // agregar rol
      newUser.role = "user";
      // crear carrito
      const newCart = await cartService.create();
      newUser.cart = newCart.cid;

      // crear usuario
      users.push(newUser);
      await writeFile(this.path, users);
      delete newUser.password;
      return newUser;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // Actualizar
  async update(uid, user) {
    try {
      const users = await readFile(this.path);
      const i = this.users.findIndex((item) => item.uid === uid);
      // verificar que exista el ID
      if (i < 0) {
        throw new CustomError(errorsDictionary.ID_NOT_FOUND);
      }
      // verificar que no elimine el ID
      if ("uid" in user) {
        delete user.uid;
      }
      // modificar usuario y actualizar DB
      users[i] = { ...users[i], ...user };
      await writeFile(this.path, users);
      return users[i];
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  //  Eliminar
  async delete(uid) {
    try {
      const users = await readFile(this.path);
      const i = users.findIndex((item) => item.uid === uid);

      // verificar que exista el ID
      if (i < 0) {
        throw new CustomError(errorsDictionary.ID_NOT_FOUND);
      }
      // Quitar usuario del array y actualizar DB
      users.splice(i, 1);
      await writeFile(this.path, users);
      return console.log(`Usuario de ID: ${uid} eliminado`);
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
      const users = await readFile(this.path);
      const user = users.find((user) => user.email === email);

      if (!user || !isValidPassword(enteredPassword, user.password))
        throw new CustomError(errorsDictionary.INVALID_PARAMETER);

      delete user.password;
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
      const users = await readFile(this.path);
      const i = users.findIndex((item) => item.uid === uid);

      // verificar que exista el ID
      if (i < 0) {
        throw new CustomError(errorsDictionary.ID_NOT_FOUND);
      }
      // modificar usuario y actualizar DB
      if (users[i].role === "user") users[i].role = "premium";
      else if (users[i].role === "premium") users[i].role = "user";
      else throw new CustomError(errorsDictionary.INVALID_PARAMETER);
      await writeFile(this.path, users);
      return users[i];
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
      const users = await readFile(this.path);
      const user = users.find((user) => user.email === email);
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
      const user = await this.getById(id);
      if (!user) throw new CustomError(errorsDictionary.USER_NOT_FOUND);
      user.password = createHash(newPassword);
      // verificar que las contraseñas no sean iguales
      if (isValidPassword(newPassword, user.password))
        throw new CustomError(errorsDictionary.PASSWORD_ALREADY_EXISTS);
      const updatedUser = await this.update(id, updatedUser);

      return updatedUser;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }
}
