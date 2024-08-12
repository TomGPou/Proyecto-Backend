import { readFile, writeFile } from "../../utils/utils.js";
import CustomError from "../../errors/CustomErrors.class.js";
import errorsDictionary from "../../errors/errrosDictionary.js";

export default class ProductService {
  constructor() {
    this.path = "./src/services/utils/products.json";
  }
  // OBTENER TODOS LOS PRODUCTOS
  async get() {
    const products = await readFile(this.path);
    return products;
  }

  // async getPaginate(limit, page, category, inStock, sort) {
  //   try {

  //   } catch (err) {
  //     if (!(err instanceof CustomError)) {
  //       throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
  //     }
  //     throw err;
  //   }
  // }

  // AGREGAR PRODUCTO
  async add(newProduct) {
    try {
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
        throw new CustomError(errorsDictionary.FEW_PARAMETERS);

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
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.name);
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  //  BUSCAR PRODUCTO POR ID
  async getById(pid) {
    try {
      const productsList = await this.get();
      const product = productsList.find((p) => p.pid === pid);

      return product || null;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.name);
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // ACTUALIZAR PRODUCTO
  async update(pid, data, user) {
    try {
      const products = await this.get();

      const i = products.findIndex((item) => item.pid === pid);
      // verificar que exista el ID
      if (i < 0) {
        throw new CustomError(errorsDictionary.ID_NOT_FOUND);
      } else {
        // verificar autorizacion para editar
        if (user !== "admin" && products[i].owner !== user) {
          throw new CustomError(errorsDictionary.USER_NOT_AUTHORIZED);
        }
        // verificar que no modifique el ID owner o code
        if (data.owner) delete data.owner;
        if (data.pid) delete data.pid;
        if (data.code) delete data.code;

        // modificar producto y actualizar DB
        products[i] = { ...products[i], ...data };

        await writeFile(this.path, products);
        return products[i];
      }
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.name);
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // BORRAR PRODUCTO
  async deleteProduct(pid, user) {
    try {
      const products = await this.get();

      const i = products.findIndex((item) => item.pid === pid);
      // verificar que exista el ID
      if (i < 0) {
        throw new CustomError(errorsDictionary.ID_NOT_FOUND);
      } else {
        // verificar autorizacion para editar
        if (user !== "admin" && products[i].owner !== user) {
          throw new CustomError(errorsDictionary.USER_NOT_AUTHORIZED);
        }
        // Quitar producto del array y actualizar DB
        products.splice(i, 1);

        await writeFile(this.path, products);
        return console.log(`Producto de ID: ${pid} eliminado`);
      }
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.name);
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // OBTENER STOCK
  async getStock(pid) {
    try {
      const product = await this.getById(pid);
      return product.stock;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.name);
        throw new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }
}
