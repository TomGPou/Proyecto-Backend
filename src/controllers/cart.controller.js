//* IMPORTS
import CartService from "../services/dao/mdb/cartService.mdb.js";
//* INIT
const cartService = new CartService();

export default class CartController {
  constructor() {}

  //* CREAR CARRITO
  create = async () => {
    const newCart = {
      products: [],
    };

    return await cartManager.create(newCart);
  };

  //* BUSCAR TODOS
  getAll = async () => {
    try {
      return await cartManager.getAll();
    } catch (error) {
      return { error: error.message };
    }
  };

  //* BUSCAR POR ID
  getById = async (cid) => {
    try {
      return await cartManager.getById(cid);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* AGREGAR PRODUCTO
  addProduct = async (cid, pid) => {
    try {
      return await cartManager.addProduct(cid, pid);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* ACTUALIZAR CANTIDAD DE PRODUCTO
  updateQty = async (cid, pid, qty) => {
    try {
      return await cartManager.updateQty(cid, pid, qty);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* BORRAR PRODUCTO
  deleteProduct = async (cid, pid) => {
    try {
      return await cartManager.deleteProduct(cid, pid);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* ACTUALIZAR CARRITO
  update = async (cid, cart) => {
    try {
      return await cartManager.update(cid, cart);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* VACIAR CARRITO
  empty = async (cid) => {
    try {
      return await cartManager.empty(cid);
    } catch (error) {
      return { error: error.message };
    }
  };
}
