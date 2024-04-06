import fs from "fs";

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./products.json";
  }

  async readFile() {
    const data = await fs.promises.readFile(this.path);
    this.products = JSON.parse(data);
  }

  async writeFile() {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products),
      "utf-8"
    );
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    // Validar la carga de datos
    if (!title || !description || !price || !thumbnail || !code || !stock)
      throw new Error("Falta completar datos del producto");

    // Validar productos duplicados
    const isDuplicated = this.products.some((product) => product.code === code);

    if (isDuplicated)
      throw new Error("El código debe ser único para cada producto");

    // Agregando producto
    const newProduct = {
      id: this.products.length + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    await this.writeFile();
    return newProduct;
  }

  // Obtener lista de productos
  async getProducts() {
    if (!this.products.length) await this.readFile();
    return this.products;
  }

  //  Buscar un producto por su id
  async getProductById(id) {
    const productsList = await this.getProducts();
    const product = productsList.find((p) => p.id === id);
    if (!product) {
      throw new Error("NOT FOUND");
    }
    return product;
  }

  // Actualizar producto
  async updateProduct(id, data) {
    const productsList = await this.getProducts();

    const i = productsList.findIndex((item) => item.id === id);
    // verificar que exista el ID
    if (i < 0) {
      throw new Error(`NOT FOUND`);
    } else {
      // verificar que no elimine el ID
      if ("id" in data) {
        delete data.id;
      }
      // modificar producto y actualizar DB
      this.products[i] = { ...this.products[i], ...data };

      await this.writeFile();
      return this.products[i];
    }
  }

  // Borrar producto
  async deleteProduct(id) {
    const productsList = await this.getProducts();

    const i = productsList.findIndex((item) => item.id === id);
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
const productManager = new ProductManager();

//  Agregar productos
productManager.addProduct(
  "Producto Prueba",
  "prueba",
  200,
  "sin imagen",
  "abc123",
  25
);

productManager.addProduct(
  "Producto Prueba2",
  "prueba2",
  200,
  "sin imagen",
  "abc124",
  25
);

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
