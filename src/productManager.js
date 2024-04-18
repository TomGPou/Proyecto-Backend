import fs from "fs";

export default class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./src/products.json";
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

  // AGREGAR PRODUCTO
  async addProduct(newProduct) {
    // Validar la carga de datos
    if (
      !newProduct.title ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.thumbnail ||
      !newProduct.code ||
      !newProduct.stock
    )
      throw new Error("Falta completar datos del producto");

    // Validar productos duplicados
    const isDuplicated = this.products.some((p) => p.code === newProduct.code);

    if (isDuplicated)
      throw new Error("El código debe ser único para cada producto");

    // Cargar al array
    newProduct.pid = this.products.length + 1;
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
      throw new Error(`NOT FOUND`);
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
  async deleteProductp(pid) {
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
      return console.log("Producto eliminado");
    }
  }
}

// TESTING
// const productManager = new ProductManager();

//  Agregar productos
// productManager.addProduct(
//   "Producto Prueba",
//   "prueba",
//   200,
//   "sin imagen",
//   "abc123",
//   25
// );

// productManager.addProduct(
//   "Producto Prueba2",
//   "prueba2",
//   200,
//   "sin imagen",
//   "abc124",
//   25
// );

// ver productos
// const productsList = productManager.getProducts();
// console.log(productsList);

//  buscar producto por ID
// const productId = await productManager.getProductById(1);
// console.log(productId);

// actualizar un producto
// const updatedProduct = await productManager.updateProduct(2, {
//   title: "Producto actualizado",
//   price: 300,
// });
// console.log(updatedProduct);

// const productsList = productManager.getProducts();
// console.log(productsList);

// borrar producto
// await productManager.deleteProduct(1);

// const productsList = productManager.getProducts();
// console.log(productsList);
