import { generateCode, readFile, writeFile } from "../../utils/utils.js";
import ProductService from "./product.service.fs.js";
import TicketService from "./ticket.service.fs.js";
import CustomError from "../../errors/CustomErrors.class.js";
import errorsDictionary from "../../errors/errrosDictionary.js";

const productService = new ProductService();
const ticketService = new TicketService();

//* MANAGER DE CARRITO

export default class CartService {
  constructor() {
    this.path = "./src/services/utils/carts.json";
  }

  // Validar ID carrito
  async validateCart(cid) {
    const carts = await readFile(this.path);
    const cartIndex = carts.findIndex((item) => item.cid === cid);

    if (cartIndex < 0) {
      return new CustomError(errorsDictionary.ID_NOT_FOUND);
    }
    return carts[cartIndex];
  }

  // Validar ID de producto
  async validateProduct(pid) {
    const product = await productService.getById(pid);

    if (!product) return new CustomError(errorsDictionary.ID_NOT_FOUND);
    return product;
  }

  //* CREAR CARRITO
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

  //* BUSCAR TODOS
  async getAll() {
    const carts = await readFile(this.path);
    return carts;
  }

  //* BUSCAR POR ID
  async getById(cid) {
    try {
      const cart = this.validateCart(cid);
      if (!cart) throw new CustomError(errorsDictionary.ID_NOT_FOUND);
      return cart;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.message);
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  //* AGREGAR PRODUCTO
  async addProduct(cid, pid, user) {
    try {
      const cart = await this.validateCart(cid);
      const product = await this.validateProduct(pid);
      // Validar owner del producto
      if (user !== "user" && user === product.owner) {
        throw new CustomError(errorsDictionary.USER_NOT_AUTHORIZED);
      }
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
      if (!(err instanceof CustomError)) {
        console.log(err.message);
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  //* ACTUALIZAR CANTIDAD DE PRODUCTO
  async updateQty(cid, pid, qty, user) {
    try {
      const cart = await this.validateCart(cid);
      const product = await this.validateProduct(pid);
      // Validar owner del producto
      if (user !== "user" && user === product.owner) {
        throw new CustomError(errorsDictionary.USER_NOT_AUTHORIZED);
      }
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
      if (!(err instanceof CustomError)) {
        console.log(err.message);
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  //* BORRAR PRODUCTO
  async deleteProduct(cid, pid) {
    try {
      const cart = await this.validateCart(cid);
      await this.validateProduct(pid);
      // Buscar producto en array y eliminar
      const productIndex = cart.products.findIndex((item) => item.pid === pid);
      cart.products.splice(productIndex, 1);
      // actualizar
      return await this.update(cid, cart.products);
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.message);
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  //* ACTUALIZAR CARRITO
  async update(cid, products) {
    try {
      const carts = await readFile(this.path);
      const cart = await this.validateCart(cid);
      // Buscar producto en array
      const cartIndex = carts.findIndex((c) => c.cid === cid);
      carts[cartIndex].products = products;
      // actualizar
      await writeFile(this.path, carts);
      return cart;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.message);
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  //* VACIAR CARRITO
  async empty(cid) {
    try {
      const cart = await this.validateCart(cid);
      cart.products = [];

      return await this.update(cid, cart.products);
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.message);
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  //* COMPRAR CARRITO
  async purchase(cid, purchaser) {
    try {
      // const carts = await readFile(this.path);
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
      await ticketService.create(ticket);
      return await this.getById(cid);
    } catch {
      if (!(err instanceof CustomError)) {
        console.log(err.message);
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }
}
