import { readFile, writeFile } from "../../utils/utils.js";
import ProductService from "./product.service.fs.js";
import TicketService from "./ticket.service.fs.js";

const productService = new ProductService();
const ticketService = new TicketService();

// MANAGER DE CARRITO

export default class CartService {
  constructor() {
    this.path = "./src/services/utils/carts.json";
  }

  // Validar ID carrito
  async validateCart(cid) {
    const carts = await readFile(this.path);
    const cartIndex = carts.findIndex((item) => item.cid === cid);

    if (cartIndex < 0) {
      throw new Error(`Carrito con ID: ${cid} no encontrado`);
    }
    return carts[cartIndex];
  }

  // Validar ID de producto
  async validateProduct(pid) {
    const product = await productService.getById(pid);

    if (!product) throw new Error(`Producto con ID: ${pid} no encontrado`);
    return product;
  }

  // CREAR CARRITO
  async create() {
    const carts = await readFile(this.path);
    const newCart = {
      cid: carts.length + 1,
      products: [],
    };

    carts.push(newCart);
    await writeFile(this.path, carts);

    return newCart;
  }

  // BUSCAR TODOS
  async getAll() {
    const carts = await readFile(this.path);
    return carts;
  }

  // BUSCAR POR ID
  async getById(cid) {
    try {
      const cart = this.validateCart(cid);
      if (cart) {
        return cart;
      } else {
        throw new Error(`Carrito con ${cid} no encontrado`);
      }
    } catch (err) {
      return { error: err.message };
    }
  }

  // AGREGAR PRODUCTO
  async addProduct(cid, pid) {
    try {
      const carts = await readFile(this.path);
      const cart = await this.validateCart(cid);
      await this.validateProduct(pid);

      // Buscar producto en array
      const productIndex = cart.products.findIndex((item) => item.pid === pid);
      // Agregarlo o sumar uno
      if (productIndex < 0) {
        cart.products.push({ pid: pid, quantity: 1 });
      } else {
        cart.products[productIndex].quantity++;
      }
      // actualizar carrito
      return await this.update(cid, cart.products);
    } catch (err) {
      return { error: err.message };
    }
  }

  //  ACTUALIZAR CANTIDAD DE PRODUCTO
  async updateQty(cid, pid, qty) {
    try {
      const carts = await readFile(this.path);
      const cart = await this.validateCart(cid);
      await this.validateProduct(pid);

      // Buscar producto en array
      const productIndex = cart.products.findIndex((item) => item.pid === pid);
      // actualizar cantidad
      if (productIndex < 0) {
        cart.products.push({ pid: pid, quantity: qty });
      } else {
        cart.products[productIndex].quantity = qty;
      }
      // actualizar carrito
      return await this.update(cid, cart.products);
    } catch (err) {
      return { error: err.message };
    }
  }

  // BORRAR PRODUCTO
  async deleteProduct(cid, pid) {
    try {
      const carts = await readFile(this.path);
      const cart = await this.validateCart(cid);
      await this.validateProduct(pid);

      // Buscar producto en array y eliminar
      const productIndex = cart.products.findIndex((item) => item.pid === pid);
      cart.products.splice(productIndex, 1);

      // actualizar
      return await this.update(cid, cart.products);
    } catch (err) {
      return { error: err.message };
    }
  }

  // ACTUALIZAR CARRITO
  async update(cid, products) {
    try {
      const carts = await readFile(this.path);
      const cart = await this.validateCart(cid);

      const cartIndex = carts.findIndex((c) => c.cid === cid);
      carts[cartIndex].products = products;

      await writeFile(this.path, carts);
      return cart;
    } catch (err) {
      return { error: err.message };
    }
  }

  // VACIAR CARRITO
  async empty(cid) {
    try {
      this.carts = await readFile(this.path);

      const cart = await this.validateCart(cid);
      cart.products = [];

      return await this.update(cid, cart.products);
    } catch (err) {
      return { error: err.message };
    }
  }

  // COMPRAR CARRITO
  async purchase(cid, purchaser) {
    try {
      const carts = await readFile(this.path);
      const cart = await this.validateCart(cid);
      let amount = 0;

      // verificar stock
      for (const product of cart.products) {
        const stock = await productService.getStock(product.pid);
        if (stock >= product.quantity) {
          await productService.update(product.pid, {
            stock: stock - product.quantity,
          });
          amount += product.quantity * product.price;
          await this.deleteProduct(cid, product.pid);
        }
      }

      // generar ticket
      const ticket = {
        purchase_datetime: Date.now(),
        amount: amount,
        purchaser: purchaser,
      };
      ticket.code = generateCode();
      await ticketsModel.create(ticket);

      return await this.getById(cid);
    } catch {
      return { error: err.message };
    }
  }
}
