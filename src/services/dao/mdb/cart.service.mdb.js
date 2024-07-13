import cartsModel from "../../../models/carts.model.js";
import { generateCode } from "../../utils/utils.js";
import ProductService from "./product.service.mdb.js";
import TicketService from "./ticket.service.mdb.js";
import mongoose from "mongoose";

const productService = new ProductService();
const ticketService = new TicketService();

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
      return await this.update(cid,  cart.products );
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
      return await this.update(cid, cart.products );
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
      return await this.update(cid, cart.products );
    } catch (err) {
      return { error: err.message };
    }
  }

  //* ACTUALIZAR CARRITO
  async update(cid, products) {
    try {
      const cart = await this.validateCart(cid);
      cart.products = products;

      return await cartsModel.findByIdAndUpdate(cid, cart, {
        new: true,
      });
    } catch (err) {
      return { error: err.message };
    }
  }

  //* VACIAR CARRITO
  async empty(cid) {
    try {
      const cart = await this.validateCart(cid);
      cart.products = [];

      return await cartsModel.findByIdAndUpdate(cid, cart, {
        new: true,
      });
    } catch (err) {
      return { error: err.message };
    }
  }

  //* COMPRAR CARRITO
  async purchase(cid, purchaser) {
    try {
      const cart = await this.validateCart(cid);
      let amount = 0;
      // verificar stock
      for (const product of cart.products) {
        const stock = await productService.getStock(product._id);
        if (stock >= product.quantity) {
          await productService.update(product._id, {
            stock: stock - product.quantity,
          });
          amount += product.quantity * product._id.price;
          await this.deleteProduct(cid, product._id);
        }
      }

      // generar ticket
      const ticket = {
        purchase_datetime: Date.now(),
        amount: amount,
        purchaser: purchaser,
      };
      ticket.code = generateCode();
      await ticketService.create(ticket);

      return await this.getById(cid);
    } catch (err) {
      return { error: err.message };
    }
  }
}
