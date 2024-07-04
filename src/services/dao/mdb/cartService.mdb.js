import cartsModel from "../../../models/carts.model.js";
import ProductService from "./productService.mdb.js";
import mongoose from "mongoose";

const productService = new ProductService();

// MANAGER DE CARRITO

export default class CartService {
  constructor() {
    this.carts = [];
  }

  // Validar ID carrito
  async validateCart(cid) {
    const cart = await cartsModel.findById(cid);
    if (!cart) throw new Error(`Carrito con ID: ${cid} no encontrado`);
    return cart;
  }
  // Validar ID de producto
  async validateProduct(pid) {
    const product = await productService.getById(pid);
    if (!product) throw new Error(`Producto con ID: ${pid} no encontrado`);
    return product;
  }
  // Actualizar carrito
  async update(cid, cart) {
    return await cartsModel.findByIdAndUpdate(cid, cart, {
      new: true,
    });
  }

  //* CREAR CARRITO
  async create(newCart) {
    return await cartsModel.create(newCart);
  }

  //* BUSCAR TODOS
  async getAll() {
    return await cartsModel.find().lean();
  }

  //* BUSCAR POR ID
  async getById(cid) {
    try {
      const cart = await cartsModel.findOne({ _id: cid }).lean();
      if (!cart) throw new Error(`Carrito con ID: ${cid} no encontrado`);
      return cart;
    } catch (err) {
      return { error: err.message };
    }
  }

  //* AGREGAR PRODUCTO
  async addProduct(cid, pid) {
    try {
      const cart = await this.validateCart(cid);
      await this.validateProduct(pid);

      // Buscar producto en array
      const productId = new mongoose.Types.ObjectId(pid);
      const productIndex = cart.products.findIndex((item) =>
        item._id.equals(productId)
      );
      // Agregarlo o sumar uno
      if (productIndex < 0) {
        cart.products.push({ _id: productId, quantity: 1 });
      } else {
        cart.products[productIndex].quantity++;
      }
      // actualizar carrito
      return await this.update(cid, { products: cart.products });
    } catch (err) {
      return { error: err.message };
    }
  }

  //* ACTUALIZAR CANTIDAD DE PRODUCTO
  async updateQty(cid, pid, qty) {
    try {
      const cart = await this.validateCart(cid);
      await this.validateProduct(pid);

      // Buscar producto en array
      const productId = new mongoose.Types.ObjectId(pid);
      const productIndex = cart.products.findIndex((item) =>
        item._id.equals(productId)
      );
      // actualizar cantidad
      if (productIndex < 0) {
        cart.products.push({ _id: productId, quantity: qty });
      } else {
        cart.products[productIndex].quantity = qty;
      }
      // actualizar carrito
      return await this.update(cid, { products: cart.products });
    } catch (err) {
      return { error: err.message };
    }
  }

  //* BORRAR PRODUCTO
  async deleteProduct(cid, pid) {
    try {
      const cart = await this.validateCart(cid);
      await this.validateProduct(pid);

      // Buscar producto en array
      const productId = new mongoose.Types.ObjectId(pid);
      const productIndex = cart.products.findIndex((item) =>
        item._id.equals(productId)
      );

      // Eliminar producto
      cart.products.splice(productIndex, 1);
      return await this.update(cid, { products: cart.products });
    } catch (err) {
      return { error: err.message };
    }
  }

  //* ACTUALIZAR CARRITO
  async update(cid, products) {
    try {
      const cart = await this.validateCart(cid);
      cart.products = products;

      return await this.update(cid, { products: cart.products });
    } catch (err) {
      return { error: err.message };
    }
  }

  //* VACIAR CARRITO
  async empty(cid) {
    try {
      const cart = await this.validateCart(cid);
      cart.products = [];

      return await this.update(cid, { products: cart.products });
    } catch (err) {
      return { error: err.message };
    }
  }
}
