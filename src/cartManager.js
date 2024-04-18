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
}

// TESTING
// const cartManager = new CartManager();

// cartManager.createCart().then(() => {
//   cartManager.createCart().then(() => {
//     cartManager.addToCart(2, 1).then((product) => console.log(product));
//   });
// });
