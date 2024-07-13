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
      return { error: error.message };
    }
  };

  //* BUSCAR POR ID
  getById = async (cid) => {
    try {
      return await cartService.getById(cid);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* AGREGAR PRODUCTO
  addProduct = async (cid, pid) => {
    try {
      return await cartService.addProduct(cid, pid);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* ACTUALIZAR CANTIDAD DE PRODUCTO
  updateQty = async (cid, pid, qty) => {
    try {
      return await cartService.updateQty(cid, pid, qty);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* BORRAR PRODUCTO
  deleteProduct = async (cid, pid) => {
    try {
      return await cartService.deleteProduct(cid, pid);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* ACTUALIZAR CARRITO
  update = async (cid, cart) => {
    try {
      return await cartService.update(cid, cart);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* VACIAR CARRITO
  empty = async (cid) => {
    try {
      return await cartService.empty(cid);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* COMPRAR CARRITO
  purchase = async (cid, purchaser) => {
    try {
      return await cartService.purchase(cid, purchaser);
    } catch (error) {
      return { error: error.message };
    }
  };
}
