import cartsModel from "../models/carts.model.js";
import ProductManager from "./productManager.mdb.js";

const productManager = new ProductManager();

// MANAGER DE CARRITO

export default class CartManager {
  constructor() {
    this.carts = [];
  }

  // CREAR CARRITO
  async createCart() {
    const newCart = {
      products: [],
    };

    return await cartsModel.create(newCart);
  }

  // BUSCAR POR ID
  async getCartById(cid) {
    return await cartsModel.find({ _id: cid }).lean()
  }

  // AGREGAR PRODUCTO
  async addProductToCart(cid, pid) {
    try {
      // validar id de carrito
      const cart = await cartsModel.findById(cid);
      if (!cart) throw new Error(`Carrito con ID: ${cid} no encontrado`);
      // validar id de producto
      const product = await productManager.getProductById(pid);
      if (!product) throw new Error(`Producto con ID: ${pid} no encontrado`);

      // buscar id de producto en el carrito
      const productIndex = cart.products.findIndex(
        (item) => item.product === pid
      );
      // si no existe, agregarlo
      if (productIndex < 0) {
        cart.products.push({ product: pid, quantity: 1 });
      } else {
        // si existe, incrementar cantidad
        cart.products[productIndex].quantity++;
      }
      // actualizar carrito
      return await cartsModel.findByIdAndUpdate(
        cid,
        { products: cart.products },
        { new: true }
      );
    } catch (err) {
      return { error: err.message };
    }
  }
}
