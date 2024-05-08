import fs from "fs";

export default class ProductManager {
  constructor() {
    this.path = './src/utils/products.json',
    this.products = [];
  }

  async readFile() {
    try {
      const data = await fs.promises.readFile(this.path);
      this.products = JSON.parse(data);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async writeFile() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products),
        "utf-8"
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // AGREGAR PRODUCTO
  async addProduct(newProduct) {
    // Leer archivo
    await this.readFile();
    // Validar la carga de datos
    if (
      !newProduct.title ||
      !newProduct.description ||
      !newProduct.category ||
      !newProduct.code ||
      !newProduct.price ||
      !newProduct.stock
    )
      throw new Error("Falta completar datos del producto");

    // Validar productos duplicados
    const isDuplicated = this.products.some((p) => p.code === newProduct.code);

    if (isDuplicated)
      throw new Error("El código debe ser único para cada producto");

    // Cargar al array
    newProduct.pid = this.products.length + 1;
    newProduct.status = true;
    this.products.push(newProduct);
    await this.writeFile();
    return newProduct;
  }

  // OBTENER TODOS LOS PRODUCTOS
  async getProducts() {
    if (!this.products.length) await this.readFile();
    return this.products;
  }

  //  BUSCAR PRODUCTO POR ID
  async getProductById(pid) {
    const productsList = await this.getProducts();
    const product = productsList.find((p) => p.pid === pid);

    return product || null;
  }

  // ACTUALIZAR PRODUCTO
  async updateProduct(pid, data) {
    const productsList = await this.getProducts();

    const i = productsList.findIndex((item) => item.pid === pid);
    // verificar que exista el ID
    if (i < 0) {
      throw new Error(`Producto con ID: ${pid} no encontrado`);
    } else {
      // verificar que no elimine el ID
      if ("pid" in data) {
        delete data.pid;
      }
      // modificar producto y actualizar DB
      this.products[i] = { ...this.products[i], ...data };

      await this.writeFile();
      return this.products[i];
    }
  }

  // BORRAR PRODUCTO
  async deleteProduct(pid) {
    const productsList = await this.getProducts();

    const i = productsList.findIndex((item) => item.pid === pid);
    // verificar que exista el ID
    if (i < 0) {
      throw new Error(`NOT FOUND`);
    } else {
      // Quitar producto del array y actualizar DB
      productsList.splice(i, 1);
      this.products = [...productsList];

      await this.writeFile();
      return console.log(`Producto de ID: ${pid} eliminado`);
    }
  }
}
