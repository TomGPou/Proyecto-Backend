import { readFile, writeFile } from "../../utils/utils.js";

export default class ProductService {
  constructor() {
    this.path = "./src/services/utils/products.json";
  }
  // OBTENER TODOS LOS PRODUCTOS
  async get() {
    const products = await readFile(this.path);
    return products;
  }

  // AGREGAR PRODUCTO
  async add(newProduct) {
    // Leer archivo
    const products = await readFile(this.path);
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
    const isDuplicated = products.some((p) => p.code === newProduct.code);

    if (isDuplicated)
      throw new Error("El código debe ser único para cada producto");

    // Cargar al array
    newProduct.pid = products.length + 1;
    newProduct.status = true;
    products.push(newProduct);
    await writeFile(this.path, products);
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
    const products = await this.get();

    const i = products.findIndex((item) => item.pid === pid);
    // verificar que exista el ID
    if (i < 0) {
      throw new Error(`Producto con ID: ${pid} no encontrado`);
    } else {
      // verificar que no elimine el ID
      if ("pid" in data) {
        delete data.pid;
      }
      // modificar producto y actualizar DB
      products[i] = { ...products[i], ...data };

      await writeFile(this.path, products);
      return products[i];
    }
  }

  // BORRAR PRODUCTO
  async deleteProduct(pid) {
    const products = await this.get();

    const i = products.findIndex((item) => item.pid === pid);
    // verificar que exista el ID
    if (i < 0) {
      throw new Error(`NOT FOUND`);
    } else {
      // Quitar producto del array y actualizar DB
      products.splice(i, 1);

      await writeFile(this.path, products);
      return console.log(`Producto de ID: ${pid} eliminado`);
    }
  }

  // OBTENER STOCK
  async getStock(pid) {
    const product = await this.getById(pid);
    return product.stock;
  }
}
