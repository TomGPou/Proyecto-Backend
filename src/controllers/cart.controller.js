//* IMPORTS
import CartManager from "./controllersDB/cartManager.mdb.js";
//* INIT
const cartManager = new CartManager();

//* CREAR CARRITO
export const createCart = async () => {
  const newCart = {
    products: [],
  };

  return await cartManager.create(newCart);
};

//* BUSCAR POR ID
export const getCartById = async (cid) => {
  try {
    return await cartManager.getById(cid);
  } catch (error) {
    return { error: error.message };
  }
};

//* AGREGAR PRODUCTO
export const addProductToCart = async (cid, pid) => {
  try {
    return await cartManager.addProduct(cid, pid);
  } catch (error) {
    return { error: error.message };
  }
};

//* ACTUALIZAR CANTIDAD DE PRODUCTO
export const updateProductQty = async (cid, pid, qty) => {
  try {
    return await cartManager.updateQty(cid, pid, qty);
  } catch (error) {
    return { error: error.message };
  }
};

//* BORRAR PRODUCTO
export const deleteProductFromCart = async (cid, pid) => {
  try {
    return await cartManager.deleteProduct(cid, pid);
  } catch (error) {
    return { error: error.message };
  }
};

//* ACTUALIZAR CARRITO
export const updateCart = async (cid, cart) => {
  try {
    return await cartManager.update(cid, cart);
  } catch (error) {
    return { error: error.message };
  }
};

//* VACIAR CARRITO
export const emptyCart = async (cid) => {
  try {
    return await cartManager.empty(cid);
  } catch (error) {
    return { error: error.message };
  }
};
