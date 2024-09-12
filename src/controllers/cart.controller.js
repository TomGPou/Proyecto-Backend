//* IMPORTS
import CartService from "../services/dao/mdb/cart.service.mdb.js";
// import CartService from "../services/dao/fileSystem/cart.service.fs.js";
//* INIT
const cartService = new CartService();

export default class CartController {
  constructor() {}

  //* CREAR CARRITO
  create = async () => {
    const newCart = {
      products: [],
    };

    return await cartService.create(newCart);
  };

  //* BUSCAR TODOS
  getAll = async () => {
    try {
      return await cartService.getAll();
    } catch (error) {
      throw error;
    }
  };

  //* BUSCAR POR ID
  getById = async (cid) => {
    try {
      return await cartService.getById(cid);
    } catch (error) {
      throw error;
    }
  };

  //* AGREGAR PRODUCTO
  addProduct = async (cid, pid, user) => {
    try {
      return await cartService.addProduct(cid, pid, user);
    } catch (error) {
      throw error;
    }
  };

  //* ACTUALIZAR CANTIDAD DE PRODUCTO
  updateQty = async (cid, pid, qty, user) => {
    try {
      return await cartService.updateQty(cid, pid, qty, user);
    } catch (error) {
      throw error;
    }
  };

  //* BORRAR PRODUCTO
  deleteProduct = async (cid, pid) => {
    try {
      // Validar owner del producto
      if (user !== "admin" && user !== product.owner) {
        throw new CustomError(errorsDictionary.USER_NOT_AUTHORIZED);
      }
      return await cartService.deleteProduct(cid, pid);
    } catch (error) {
      throw error;
    }
  };

  //* ACTUALIZAR CARRITO
  update = async (cid, cart) => {
    try {
      return await cartService.update(cid, cart);
    } catch (error) {
      throw error;
    }
  };

  //* VACIAR CARRITO
  empty = async (cid) => {
    try {
      return await cartService.empty(cid);
    } catch (error) {
      throw error;
    }
  };

  //* COMPRAR CARRITO
  purchase = async (cid, purchaser) => {
    try {
      return await cartService.purchase(cid, purchaser);
    } catch (error) {
      throw error;
    }
  };

  //* ELIMINAR CARRITO
  delete = async (cid) => {
    try {
      return await cartService.delete(cid);
    } catch (error) {
      throw error;
    }
  };
}
