import { readFile, writeFile } from "../../utils/utils.js";

export default class ProductService {
  constructor() {
    (this.path = "./src/utils/products.json"), (this.products = []);
  }
  // OBTENER TODOS LOS PRODUCTOS
  async get() {
    if (!this.products.length) {
      this.products = await readFile(this.path);
    }
    return this.products;
  }

  // AGREGAR PRODUCTO
  async add(newProduct) {
    // Leer archivo
    this.products = await readFile(this.path);
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
    await writeFile(this.path, this.products);
    return newProduct;
  }

  //  BUSCAR PRODUCTO POR ID
  async getById(pid) {
    const productsList = await this.get();
    const product = productsList.find((p) => p.pid === pid);

    return product || null;
  }

  // ACTUALIZAR PRODUCTO
  async update(pid, data) {
    const productsList = await this.get();

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

      await writeFile(this.path, this.products);
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

      await writeFile(this.path, this.products);
      return console.log(`Producto de ID: ${pid} eliminado`);
    }
  }

  // OBTENER STOCK
  async getStock(pid) {
    const product = await this.getById(pid);
    return product.stock;
  }
}
