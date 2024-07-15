//* IMPORTS
import UsersService from "../services/dao/mdb/users.service.mdb.js";
// import UsersService from "../services/dao/fileSystem/users.service.fs.js";
//* INIT
const usersService = new UsersService();

// DTO
export class UsersDTO {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role;
  }
}

// CONTROLLER
export default class UserController {
  constructor() {}

  //* OBTENER TODOS
  getAll = async () => {
    try {
      return await usersService.getAll();
    } catch (error) {
      console.log(error);
    }
  };

  //* OBTENER POR ID
  getById = async (uid) => {
    try {
      return await usersService.getById(uid);
    } catch (error) {
      console.log(error);
    }
  };

  //* OBTENER UN USUARIO POR QUERY
  getOne = async (query) => {
    try {
      return await usersService.getOne(query);
    } catch (error) {
      console.log(error);
    }
  };

  //* CREAR USUARIO
  create = async (user) => {
    try {
      // validar carga de datos
      if (!user.first_name || !user.last_name || !user.email || !user.password)
        throw new Error("Datos incompletos");

      return await usersService.create(user);
    } catch (error) {
      console.log(error);
    }
  };

  //* ACTUALIZAR USUARIO
  update = async (uid, user) => {
    try {
      if (user.email) {
        return await usersService.update(uid, user);
      }

      return await usersService.update(uid, user);
    } catch {
      console.log(error);
    }
  };

  //* ELIMINAR USUARIO
  delete = async (uid) => {
    try {
      return await usersService.delete(uid);
    } catch {
      console.log(error);
    }
  };

  //* LOGIN
  login = async (email, enteredPassword) => {
    try {
      return await usersService.login(email, enteredPassword);
    } catch {
      console.log(error);
      return null;
    }
  };
}
