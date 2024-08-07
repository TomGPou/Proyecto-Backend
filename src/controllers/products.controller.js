//* IMPORTS
import ProductService from "../services/dao/mdb/product.service.mdb.js";
// import ProductService from "../services/dao/fileSystem/product.service.fs.js";
//* INIT
const productService = new ProductService();

//* CONTROLLER
export default class ProductController {
  constructor() {}

  //* OBTENER PRODUCTOS
  get = async () => {
    try {
      return await productService.get();
    } catch (error) {
      throw error;
    }
  };

  getPaginate = async (limit, page, category, inStock, sort) => {
    try {
      return await productService.getPaginate(
        limit,
        page,
        category,
        inStock,
        sort
      );
    } catch (error) {
      throw error;
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
      throw error;
    }
  };

  //*  BUSCAR PRODUCTO POR ID
  getById = async (pid) => {
    try {
      return await productService.getById(pid);
    } catch (error) {
      throw error;
    }
  };

  //* ACTUALIZAR PRODUCTO
  update = async (pid, data, user) => {
    try {
      if (data.code) {
        return await productService.update(pid, data, user);
      }
      return await productService.update(pid, data);
    } catch (error) {
      throw error;
    }
  };

  //* BORRAR PRODUCTO
  deleteProduct = async (pid, user) => {
    try {
      return await productService.deleteProduct(pid, user);
    } catch (error) {
      console.log(error);

      throw error;
    }
  };
}
