import fs from "fs";

export default class CartManager {
  constructor() {
    this.path = "./src/carts.json";
    this.carts = [];
  }

  async readFile() {
    try {
      const data = await fs.promises.readFile(this.path);
      this.carts = JSON.parse(data);
      return this.carts;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async writeFile() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts),
        "utf-8"
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // CREAR CARRITO
  async createCart() {
    await this.readFile();
    const newCart = {
      cid: this.carts.length + 1,
      products: [],
    };

    this.carts.push(newCart);
    await this.writeFile();

    return newCart;
  }

  // BUSCAR POR ID
  async getCartById(cid) {
    try {
      await this.readFile();

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
  async addProductToCart(cid, pid) {
    try {
      await this.readFile();
      // buscar id de carrito
      const cartIndex = this.carts.findIndex((item) => item.cid === cid);

      if (cartIndex < 0) {
        throw new Error(`Carrito con ID: ${cid} no encontrado`);
      } else {
        const cart = this.carts[cartIndex];
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

        await this.writeFile();
        console.log(cart);
        return cart;
      }
    } catch (err) {
      return { error: err.message };
    }
  }
}
