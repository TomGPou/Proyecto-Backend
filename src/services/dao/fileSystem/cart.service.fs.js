import { readFile, writeFile } from '../../utils/utils.js'
import ProductService from './product.service.fs.js';

const productService = new ProductService();

// MANAGER DE CARRITO

export default class CartService {
  constructor() {
    this.path = './src/utils/carts.json',
      this.carts = [];
  }

  // Validar ID carrito
  async validateCart(cid) {
    const cartIndex = this.carts.findIndex((item) => item.cid === cid);

    if (cartIndex < 0) {
      throw new Error(`Carrito con ID: ${cid} no encontrado`);
    }
    return this.carts[cartIndex];
  }

  // Validar ID de producto
  async validateProduct(pid) {
    const product = await productService.getById(pid);

    if (!product) throw new Error(`Producto con ID: ${pid} no encontrado`);
    return product;
  }

  // CREAR CARRITO
  async create() {
    this.carts = await readFile(this.path);
    const newCart = {
      cid: this.carts.length + 1,
      products: [],
    };

    this.carts.push(newCart);
    await writeFile(this.path, this.carts)

    return newCart;
  }

  // BUSCAR TODOS
  async getAll() {
    return this.carts = await readFile(this.path);
  }

  // BUSCAR POR ID
  async getById(cid) {
    try {
      this.carts = await readFile(this.path);

      const cart = this.carts.find((cart) => cart.cid === cid);
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
      this.carts = await readFile(this.path);

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
      await writeFile(this.path, this.carts);
      return cart;
    } catch (err) {
      return { error: err.message };
    }
  }

  //  ACTUALIZAR CANTIDAD DE PRODUCTO
  async updateQty(cid, pid, qty) {
    try {
      this.carts = await readFile(this.path);

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
      await writeFile(this.path, this.carts);
      return cart;

    } catch (err) {
      return { error: err.message };
    }
  }

  // BORRAR PRODUCTO
  async deleteProduct(cid, pid) {
    try {
      this.carts = await readFile(this.path);

      const cart = await this.validateCart(cid);
      await this.validateProduct(pid);

      // Buscar producto en array
      const productIndex = cart.products.findIndex((item) => item.pid === pid);

      // Eliminar producto
      cart.products.splice(productIndex, 1);
      await writeFile(this.path, this.carts);
      return cart;
    } catch (err) {
      return { error: err.message };
    }
  }

  // ACTUALIZAR CARRITO
  async update(cid, products) {
    try {
      this.carts = await readFile(this.path);

      const cart = await this.validateCart(cid);
      cart.products = products;

      await writeFile(this.path, this.carts);
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

      await writeFile(this.path, this.carts);
      return cart;

      } catch (err) {
      return { error: err.message };
    }
  }
}
