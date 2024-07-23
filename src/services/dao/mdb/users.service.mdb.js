import CartService from "./cart.service.mdb.js";
import usersModel from "./models/users.model.js";
import {
  createHash,
  isValidPassword,
  schemaErrorHandler,
} from "../../utils/utils.js";
import CustomError from "../../errors/CustomErrors.class.js";
import errorsDictionary from "../../errors/errrosDictionary.js";

// INIT
const cartService = new CartService();

export default class UsersService {
  constructor() {}
  // Obtener todos
  async getAll() {
    try {
      const users = await usersModel.find();
      return users;
    } catch (error) {
      console.log(error);
    }
  }

  // Obtener por id
  async getById(id) {
    try {
      const user = await usersModel.findById(id);
      if (!user) throw new CustomError(errorsDictionary.ID_NOT_FOUND);
      return user;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR, err.message);
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
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR, err.message);
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
      console.log(user);
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
        if (err.name === "ValidationError") {
          schemaErrorHandler(err);
        } else {
          throw new CustomError(errorsDictionary.UNHANDLED_ERROR, err.message);
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
        if (err.name === "ValidationError") {
          schemaErrorHandler(err);
        } else {
          throw new CustomError(errorsDictionary.UNHANDLED_ERROR, err.message);
        }
      }
      throw err;
    }
  }
  // Eliminar
  async delete(uid) {
    try {
      const deletedUser = await usersModel.findByIdAndDelete(uid);
      if (!deletedUser) throw new CustomError(errorsDictionary.USER_NOT_FOUND);
      return deletedUser;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR, err.message);
      }
      throw err;
    }
  }

  // Login
  async login(email, enteredPassword) {
    try {
      const user = await usersModel.findOne({ email }).lean();

      if (!user || !isValidPassword(enteredPassword, user.password))
        throw new CustomError(errorsDictionary.INVALID_PARAMETER);

      delete user.password;
      return user;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR, err.message);
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
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR, err.message);
      }
      throw err;
    }
  }
}
