//* IMPORTS
import ProductService from "../services/dao/mdb/productService.mdb.js";
//* INIT
const productService = new ProductService();

export default class ProductController {
  constructor() {}

  //* OBTENER PRODUCTOS
  get = async (limit, page, category, inStock, sort) => {
    try {
      return await productService.get(limit, page, category, inStock, sort);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* AGREGAR PRODUCTO
  add = async (newProduct) => {
    try {
      // Validar la carga de datos
      if (
        !newProduct.title ||
        !newProduct.description ||
        !newProduct.category ||
        !newProduct.code ||
        !newProduct.price ||
        !newProduct.stock
      ) {
        throw new Error("Falta completar datos del producto");
      }
      return await productService.add(newProduct);
    } catch (error) {
      return { error: error.message };
    }
  };

  //*  BUSCAR PRODUCTO POR ID
  getById = async (pid) => {
    try {
      return await productService.getById(pid);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* ACTUALIZAR PRODUCTO
  update = async (pid, data) => {
    try {
      return await productService.update(pid, data);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* BORRAR PRODUCTO
  deleteProduct = async (pid) => {
    try {
      return await productService.deleteProduct(pid);
    } catch (error) {
      return { error: error.message };
    }
  };
}
