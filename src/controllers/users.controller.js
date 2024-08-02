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
      return { error: error.message };
    }
  };

  //* OBTENER POR ID
  getById = async (uid) => {
    try {
      return await usersService.getById(uid);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* OBTENER UN USUARIO POR QUERY
  getOne = async (query) => {
    try {
      return await usersService.getOne(query);
    } catch (error) {
      return { error: error.message };
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
      return { error: error.message };
    }
  };

  //* ACTUALIZAR USUARIO
  update = async (uid, user) => {
    try {
      if (user.email) {
        return await usersService.update(uid, user);
      }

      return await usersService.update(uid, user);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* ELIMINAR USUARIO
  delete = async (uid) => {
    try {
      return await usersService.delete(uid);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* LOGIN
  login = async (email, enteredPassword) => {
    try {
      return await usersService.login(email, enteredPassword);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* CAMBIAR ROL
  changeRole = async (uid) => {
    try {
      return await usersService.changeRole(uid);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* RESTORE LINK
  restoreLink = async (email) => {
    try {
      return await usersService.restoreLink(email);
    } catch (error) {
      return { error: error.message };
    }
  };
  //* CAMBIAR CONTRASEÑA
  changePassword = async (id, newPassword) => {
    try {
      return await usersService.changePassword(id, newPassword);
    } catch (error) {
      return { error: error.message };
    }
  };
}
