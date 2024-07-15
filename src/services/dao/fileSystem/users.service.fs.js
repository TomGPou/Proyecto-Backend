import {
  readFile,
  writeFile,
  createHash,
  isValidPassword,
} from "../../utils/utils.js";
import CartService from "./cart.service.fs.js";

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
    } catch (error) {
      console.log(error);
    }
  }

  // Obtener por id
  async getById(id) {
    try {
      const users = await readFile(this.path);
      const user = users.find((user) => user.uid === id);
      if (!user) throw new Error("Usuario no encontrado");
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  // getOne
  async getOne(query) {
    try {
      const users = await readFile(this.path);
      const user = users.find((user) =>
        Object.keys(query).every((key) => user[key] === query[key])
      );
      if (!user) throw new Error("Usuario no encontrado");
      delete user.password;
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  // Crear
  async create(newUser) {
    try {
      const users = await readFile(this.path);
      // validar email
      const emailExists = users.find((user) => user.email === newUser.email);
      if (emailExists) throw new Error("Email ya registrado");

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
      return newUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // Actualizar
  async update(uid, user) {
    try {
      const users = await readFile(this.path);
      const i = this.users.findIndex((item) => item.uid === uid);
      // verificar que exista el ID
      if (i < 0) {
        throw new Error(`Usuario con ID: ${uid} no encontrado`);
      }
      // verificar que no elimine el ID
      if ("uid" in user) {
        delete user.uid;
      }
      // modificar usuario y actualizar DB
      users[i] = { ...users[i], ...user };
      await writeFile(this.path, users);
      return users[i];
    } catch (error) {
      console.log(error);
    }
  }

  //  Eliminar
  async delete(uid) {
    try {
      const users = await readFile(this.path);
      const i = users.findIndex((item) => item.uid === uid);

      // verificar que exista el ID
      if (i < 0) {
        throw new Error(`Usuario con ID: ${uid} no encontrado`);
      }
      // Quitar usuario del array y actualizar DB
      users.splice(i, 1);
      await writeFile(this.path, users);
      return console.log(`Usuario de ID: ${uid} eliminado`);
    } catch (error) {
      console.log(error);
    }
  }

  // Login
  async login(email, enteredPassword) {
    try {
      const users = await readFile(this.path);
      const user = users.find((user) => user.email === email);

      if (!user || !isValidPassword(enteredPassword, user.password))
        throw new Error("Datos de acceso no válidos");

      delete user.password;
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
