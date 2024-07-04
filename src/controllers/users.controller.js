//* IMPORTS
import UsersService from "../services/dao/mdb/usersService.mdb.js";
//* INIT
const usersService = new UsersService();

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
      return usersService.update(uid, user);
    } catch {
      console.log(error);
    }
  };

  //* ELIMINAR USUARIO
  delete = async (uid) => {
    try {
      return usersService.delete(uid);
    } catch {
      console.log(error);
    }
  };

  //* LOGIN
  login = async (email, enteredPassword) => {
    try {
      return usersService.login(email, enteredPassword);
    } catch {
      console.log(error);
      return null;
    }
  };
}
