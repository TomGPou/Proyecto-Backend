import CartService from "./cart.service.mdb.js";
import usersModel from "./models/users.model.js";
import { createHash, isValidPassword } from "../../utils/utils.js";

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
      if (!user) throw new Error("Usuario no encontrado");
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  // getOne
  async getOne(query) {
    try {
      const user = await usersModel.findOne(query);
      if (!user) throw new Error("Usuario no encontrado");
      delete user.password;

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  // Crear
  async create(user) {
    try {
      // validar email
      const existingUser = await usersModel.findOne({ email: user.email });
      if (existingUser) throw new Error("Email ya registrado");
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
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // Actualizar
  async update(uid, user) {
    try {
      const updatedUser = await usersModel.findByIdAndUpdate(uid, user, {
        new: true,
      });
      if (!updatedUser) throw new Error("Usuario no encontrado");
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }
  // Eliminar
  async delete(uid) {
    try {
      const deletedUser = await usersModel.findByIdAndDelete(uid);
      if (!deletedUser) throw new Error("Usuario no encontrado");
      return deletedUser;
    } catch (error) {
      console.log(error);
    }
  }

  // Login
  async login(email, enteredPassword) {
    try {
      const user = await usersModel.findOne({ email }).lean();

      if (!user || !isValidPassword(enteredPassword, user.password))
        throw new Error("Datos de acceso no válidos");

      delete user.password;
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // Buscar por cart
  async getByCart(cid) {
    try {
      const user = await usersModel.findOne({ cart: cid });
      if (!user) throw new Error("Usuario no encontrado");
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
