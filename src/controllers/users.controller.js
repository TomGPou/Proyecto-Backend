//* IMPORTS
import UsersManager from "../services/mdb/usersManager.mdb.js";
//* INIT
const usersManager = new UsersManager();

//* OBTENER TODOS
export const getAllUsers = async () => {
  try {
    return await usersManager.getAll();
  } catch (error) {
    console.log(error);
  }
};

//* OBTENER POR ID
export const getUserById = async (uid) => {
  try {
    return await usersManager.getById(uid);
  } catch (error) {
    console.log(error);
  }
};

//* OBTENER UN USUARIO POR QUERY
export const getOneUser = async (query) => {
  try {
    return await usersManager.getOne(query);
  } catch (error) {
    console.log(error);
  }
};

//* CREAR USUARIO
export const createUser = async (user) => {
  try {
    // validar carga de datos
    if (!user.first_name || !user.last_name || !user.email || !user.password)
      throw new Error("Datos incompletos");
    return await usersManager.create(user);
  } catch (error) {
    console.log(error);
  }
};

//* ACTUALIZAR USUARIO
export const updateUser = async (uid, user) => {
  try {
    return usersManager.update(uid, user);
  } catch {
    console.log(error);
  }
};

//* ELIMINAR USUARIO
export const deleteUser = async (uid) => {
  try {
    return usersManager.delete(uid);
  } catch {
    console.log(error);
  }
};

//* LOGIN
export const loginUser = async (email, enteredPassword) => {
  try {
    return usersManager.login(email, enteredPassword);
  } catch {
    console.log(error);
    return null;
  }
};
